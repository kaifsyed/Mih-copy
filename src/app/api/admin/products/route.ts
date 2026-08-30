import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { validateCategorization } from "@/lib/products";
import { validatePricing } from "@/lib/pricing";
import { validateProductImage } from "@/lib/product-image";

export const runtime = "nodejs";

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  const { userId } = await auth();

  if (!isAdmin(userId)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Load products error:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!isAdmin(userId)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const detail = String(formData.get("detail") || "").trim();
    const carat = String(formData.get("carat") || "").trim();
    const subcategory = String(formData.get("subcategory") || "").trim();
    const status = String(
      formData.get("status") || "Enquire"
    ).trim();

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

    // Validate category + jewellery subcategory + carat together. The helper is
    // the single source of truth (also used client-side and by PATCH) and
    // returns the normalized fields to store: Gemstones never keep a
    // subcategory, Jewellery never keeps carat.
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

    // Validate pricing (fixed / range / negotiable) via the shared helper so
    // the admin API and the customer-facing display agree on what's valid.
    const pricing = validatePricing({
      pricing_type: String(formData.get("pricing_type") || "enquiry").trim(),
      price: formData.get("price"),
      price_min: formData.get("price_min"),
      price_max: formData.get("price_max"),
    });

    if (!pricing.ok) {
      return NextResponse.json({ error: pricing.error }, { status: 400 });
    }

    // Validate the upload BEFORE creating the row, so a rejected image cannot
    // leave a half-created product behind.
    const imageCheck = await validateProductImage(image);

    if (!imageCheck.ok) {
      return NextResponse.json(
        { error: imageCheck.error },
        { status: 400 }
      );
    }

    const validatedImage = imageCheck.image;

    const slug = createSlug(name);

    const { data: product, error: productError } =
      await supabaseAdmin
        .from("products")
        .insert({
          name,
          slug,
          category: categorization.value.category,
          subcategory: categorization.value.subcategory,
          detail: detail || null,
          carat: categorization.value.carat,
          status: status || "Enquire",
          description: description || null,
          ...pricing.value,
        })
        .select()
        .single();

    if (productError || !product) {
      console.error(
        "Create product database error:",
        productError
      );

      return NextResponse.json(
        {
          error:
            productError?.message ||
            "Failed to create product",
        },
        { status: 500 }
      );
    }

    if (validatedImage) {
      const filePath =
        `products/${product.id}/main.${validatedImage.extension}`;

      const { error: uploadError } =
        await supabaseAdmin.storage
          .from("Product-images")
          .upload(filePath, validatedImage.buffer, {
            contentType: validatedImage.contentType,
            upsert: true,
          });

      if (uploadError) {
        console.error(
          "Image upload error:",
          uploadError
        );

        await supabaseAdmin
          .from("products")
          .delete()
          .eq("id", product.id);

        return NextResponse.json(
          { error: uploadError.message },
          { status: 500 }
        );
      }

      const { data: publicUrlData } =
        supabaseAdmin.storage
          .from("Product-images")
          .getPublicUrl(filePath);

      const imageUrl =
        publicUrlData.publicUrl;

      const {
        data: updatedProduct,
        error: updateError,
      } = await supabaseAdmin
        .from("products")
        .update({
          image_url: imageUrl,
          image_path: filePath,
        })
        .eq("id", product.id)
        .select()
        .single();

      if (updateError || !updatedProduct) {
        console.error(
          "Save image path error:",
          updateError
        );

        await supabaseAdmin.storage
          .from("Product-images")
          .remove([filePath]);

        await supabaseAdmin
          .from("products")
          .delete()
          .eq("id", product.id);

        return NextResponse.json(
          {
            error:
              updateError?.message ||
              "Failed to save product image",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        updatedProduct,
        { status: 201 }
      );
    }

    return NextResponse.json(
      product,
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create product API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create product",
      },
      { status: 500 }
    );
  }
}