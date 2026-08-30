import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { validateCategorization } from "@/lib/products";
import { validatePricing } from "@/lib/pricing";
import { validateProductImage } from "@/lib/product-image";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  const { userId } = await auth();

  if (!isAdmin(userId)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    const { data: existingProduct, error: existingError } =
      await supabaseAdmin
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (existingError || !existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const detail = String(formData.get("detail") || "").trim();
    const carat = String(formData.get("carat") || "").trim();
    const subcategory = String(formData.get("subcategory") || "").trim();
    const status = String(formData.get("status") || "Enquire").trim();
    const description = String(
      formData.get("description") || ""
    ).trim();

    const image = formData.get("image");

    if (!name) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const categorization = validateCategorization({
      category,
      subcategory,
      carat,
    });

    if (!categorization.ok) {
      return NextResponse.json(
        { error: categorization.error },
        { status: 400 }
      );
    }

    const pricing = validatePricing({
      pricing_type: String(formData.get("pricing_type") || "enquiry").trim(),
      price: formData.get("price"),
      price_min: formData.get("price_min"),
      price_max: formData.get("price_max"),
    });

    if (!pricing.ok) {
      return NextResponse.json({ error: pricing.error }, { status: 400 });
    }

    const imageCheck = await validateProductImage(image);

    if (!imageCheck.ok) {
      return NextResponse.json(
        { error: imageCheck.error },
        { status: 400 }
      );
    }

    const validatedImage = imageCheck.image;

    const updateData: Record<string, string | number | null> = {
      name,
      category: categorization.value.category,
      subcategory: categorization.value.subcategory,
      detail: detail || null,
      carat: categorization.value.carat,
      status: status || "Enquire",
      description: description || null,
      ...pricing.value,
    };

    let newImagePath: string | null = null;
    let newImageUrl: string | null = null;

    if (validatedImage) {
      newImagePath =
        `products/${id}/main.${validatedImage.extension}`;

      const { error: uploadError } =
        await supabaseAdmin.storage
          .from("Product-images")
          .upload(newImagePath, validatedImage.buffer, {
            contentType: validatedImage.contentType,
            upsert: true,
          });

      if (uploadError) {
        return NextResponse.json(
          { error: uploadError.message },
          { status: 500 }
        );
      }

      const { data: publicUrlData } =
        supabaseAdmin.storage
          .from("Product-images")
          .getPublicUrl(newImagePath);

      newImageUrl = publicUrlData.publicUrl;

      updateData.image_path = newImagePath;
      updateData.image_url = newImageUrl;
    }

    const { data: updatedProduct, error: updateError } =
      await supabaseAdmin
        .from("products")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (updateError || !updatedProduct) {
      /*
       Only remove the new upload if it used a NEW path.
       If it overwrote the existing path, we must not delete it.
      */
      if (
        newImagePath &&
        newImagePath !== existingProduct.image_path
      ) {
        await supabaseAdmin.storage
          .from("Product-images")
          .remove([newImagePath]);
      }

      return NextResponse.json(
        {
          error:
            updateError?.message ||
            "Failed to update product",
        },
        { status: 500 }
      );
    }

    /*
     If the image extension changed:
     main.jpg → main.png

     Remove the old file only after the database
     update has succeeded.
    */
    if (
      newImagePath &&
      existingProduct.image_path &&
      existingProduct.image_path !== newImagePath
    ) {
      await supabaseAdmin.storage
        .from("Product-images")
        .remove([existingProduct.image_path]);
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Product update error:", error);

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  const { userId } = await auth();

  if (!isAdmin(userId)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    const { data: product, error: findError } =
      await supabaseAdmin
        .from("products")
        .select("id, image_path")
        .eq("id", id)
        .single();

    if (findError || !product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    /*
     Delete the storage image first.
     If this fails, the product remains intact.
    */
    if (product.image_path) {
      const { error: storageError } =
        await supabaseAdmin.storage
          .from("Product-images")
          .remove([product.image_path]);

      if (storageError) {
        return NextResponse.json(
          {
            error:
              `Failed to delete product image: ${storageError.message}`,
          },
          { status: 500 }
        );
      }
    }

    /*
     Only delete the database record after
     image cleanup succeeds.
    */
    const { error: deleteError } =
      await supabaseAdmin
        .from("products")
        .delete()
        .eq("id", id);

    if (deleteError) {
      return NextResponse.json(
        {
          error:
            `Image was deleted, but product deletion failed: ${deleteError.message}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Product delete error:", error);

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}