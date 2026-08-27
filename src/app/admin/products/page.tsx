"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  detail: string | null;
  carat: string | null;
  status: "Available" | "Enquire";
  description: string | null;
  color: "blue" | "red" | "green" | null;
  image_url: string | null;
  created_at: string;
};

const emptyForm = {
  name: "",
  category: "",
  detail: "",
  carat: "",
  status: "Enquire" as "Available" | "Enquire",
  description: "",
  color: "blue" as "blue" | "red" | "green",
};

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage("Could not load products.");
      setLoading(false);
      return;
    }

    setProducts(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function updateForm(field: keyof typeof emptyForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleImageChange(file: File | null) {
    setSelectedImage(file);

    if (!file) {
      setImagePreview(editingProduct?.image_url ?? null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  function openAddForm() {
    setEditingProduct(null);
    setForm(emptyForm);
    setSelectedImage(null);
    setImagePreview(null);
    setMessage("");
    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);

    setForm({
      name: product.name,
      category: product.category,
      detail: product.detail ?? "",
      carat: product.carat ?? "",
      status: product.status,
      description: product.description ?? "",
      color: product.color ?? "blue",
    });

    setSelectedImage(null);
    setImagePreview(product.image_url ?? null);
    setMessage("");
    setShowForm(true);
  }

  async function uploadImage(file: File, productId: string) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `${productId}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("Product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("Product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSaveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.category.trim()) {
      setMessage("Product name and category are required.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      if (editingProduct) {
        let imageUrl = editingProduct.image_url;

        if (selectedImage) {
          imageUrl = await uploadImage(selectedImage, editingProduct.id);
        }

        const { error } = await supabase
          .from("products")
          .update({
            name: form.name.trim(),
            slug: createSlug(form.name),
            category: form.category.trim(),
            detail: form.detail.trim() || null,
            carat: form.carat.trim() || null,
            status: form.status,
            description: form.description.trim() || null,
            color: form.color,
            image_url: imageUrl,
          })
          .eq("id", editingProduct.id);

        if (error) {
          throw error;
        }

        setMessage("Product updated successfully.");
      } else {
        const slug = createSlug(form.name);

        const { data: newProduct, error } = await supabase
          .from("products")
          .insert({
            slug,
            name: form.name.trim(),
            category: form.category.trim(),
            detail: form.detail.trim() || null,
            carat: form.carat.trim() || null,
            status: form.status,
            description: form.description.trim() || null,
            color: form.color,
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        let imageUrl: string | null = null;

        if (selectedImage && newProduct) {
          imageUrl = await uploadImage(selectedImage, newProduct.id);

          const { error: imageUpdateError } = await supabase
            .from("products")
            .update({
              image_url: imageUrl,
            })
            .eq("id", newProduct.id);

          if (imageUpdateError) {
            throw imageUpdateError;
          }
        }

        setMessage("Product added successfully.");
      }

      setForm(emptyForm);
      setEditingProduct(null);
      setSelectedImage(null);
      setImagePreview(null);
      setShowForm(false);

      await loadProducts();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProduct(id: string, name: string) {
    const confirmed = window.confirm(
      `Delete "${name}" from the catalogue?`
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      setMessage(error.message);
      return;
    }

    setMessage("Product deleted.");
    await loadProducts();
  }

  return (
    <main className="min-h-screen bg-[#0b0a09] text-[#f5efe5]">
      <header className="border-b border-[#c9a45c]/20">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/admin"
            className="text-xl font-semibold tracking-[0.25em]"
          >
            MIH GEMS
          </Link>

          <div className="flex items-center gap-5">
            <Link
              href="/admin"
              className="text-sm text-[#9f9689] hover:text-[#d7b56d]"
            >
              Dashboard
            </Link>

            <Link
              href="/"
              className="text-sm text-[#9f9689] hover:text-[#d7b56d]"
            >
              Website
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#d7b56d]">
              Administration
            </p>

            <h1 className="mt-3 text-4xl font-light sm:text-5xl">
              Products
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#8f8678]">
              Manage the gemstones displayed in the MIH GEMS catalogue.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="rounded-full bg-[#d7b56d] px-6 py-3 text-sm font-semibold text-[#0b0a09]"
          >
            + Add Product
          </button>
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-[#c9a45c]/20 bg-[#100f0d] px-5 py-4 text-sm text-[#d7b56d]">
            {message}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSaveProduct}
            className="mt-8 rounded-2xl border border-[#c9a45c]/20 bg-[#100f0d] p-6 sm:p-8"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#d7b56d]">
                {editingProduct ? "Edit gemstone" : "New gemstone"}
              </p>

              <h2 className="mt-2 text-2xl font-light">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-[#81786d]">
                  Product Name *
                </span>

                <input
                  value={form.name}
                  onChange={(event) =>
                    updateForm("name", event.target.value)
                  }
                  placeholder="Natural Blue Sapphire"
                  className="mt-2 w-full rounded-xl border border-[#c9a45c]/20 bg-[#0b0a09] px-4 py-3 text-sm outline-none focus:border-[#d7b56d]"
                  required
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-wider text-[#81786d]">
                  Category *
                </span>

                <input
                  value={form.category}
                  onChange={(event) =>
                    updateForm("category", event.target.value)
                  }
                  placeholder="Blue Sapphire"
                  className="mt-2 w-full rounded-xl border border-[#c9a45c]/20 bg-[#0b0a09] px-4 py-3 text-sm outline-none focus:border-[#d7b56d]"
                  required
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-wider text-[#81786d]">
                  Detail
                </span>

                <input
                  value={form.detail}
                  onChange={(event) =>
                    updateForm("detail", event.target.value)
                  }
                  placeholder="Ceylon • Unheated"
                  className="mt-2 w-full rounded-xl border border-[#c9a45c]/20 bg-[#0b0a09] px-4 py-3 text-sm outline-none focus:border-[#d7b56d]"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-wider text-[#81786d]">
                  Carat / Size
                </span>

                <input
                  value={form.carat}
                  onChange={(event) =>
                    updateForm("carat", event.target.value)
                  }
                  placeholder="2.03 ct"
                  className="mt-2 w-full rounded-xl border border-[#c9a45c]/20 bg-[#0b0a09] px-4 py-3 text-sm outline-none focus:border-[#d7b56d]"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-wider text-[#81786d]">
                  Status
                </span>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateForm(
                      "status",
                      event.target.value as "Available" | "Enquire"
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-[#c9a45c]/20 bg-[#0b0a09] px-4 py-3 text-sm outline-none focus:border-[#d7b56d]"
                >
                  <option value="Available">Available</option>
                  <option value="Enquire">Enquire</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-wider text-[#81786d]">
                  Gemstone Colour
                </span>

                <select
                  value={form.color}
                  onChange={(event) =>
                    updateForm(
                      "color",
                      event.target.value as "blue" | "red" | "green"
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-[#c9a45c]/20 bg-[#0b0a09] px-4 py-3 text-sm outline-none focus:border-[#d7b56d]"
                >
                  <option value="blue">Blue</option>
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                </select>
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs uppercase tracking-wider text-[#81786d]">
                  Product Image
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) =>
                    handleImageChange(event.target.files?.[0] ?? null)
                  }
                  className="mt-2 block w-full text-sm text-[#a59b8d] file:mr-4 file:rounded-full file:border-0 file:bg-[#d7b56d] file:px-5 file:py-2 file:text-xs file:font-semibold file:text-[#0b0a09]"
                />

                {imagePreview && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs uppercase tracking-wider text-[#81786d]">
                      Image Preview
                    </p>

                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="h-48 w-48 rounded-2xl border border-[#c9a45c]/20 object-cover"
                    />
                  </div>
                )}
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs uppercase tracking-wider text-[#81786d]">
                  Description
                </span>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  placeholder="Describe the gemstone, origin, quality and character..."
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-[#c9a45c]/20 bg-[#0b0a09] px-4 py-3 text-sm outline-none focus:border-[#d7b56d]"
                />
              </label>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#d7b56d] px-7 py-3 text-sm font-semibold text-[#0b0a09] disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingProduct
                    ? "Update Product"
                    : "Save Product"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                  setForm(emptyForm);
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
                className="rounded-full border border-[#c9a45c]/30 px-7 py-3 text-sm text-[#d7b56d]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-12 overflow-hidden rounded-2xl border border-[#c9a45c]/15 bg-[#100f0d]">
          <div className="hidden grid-cols-[2fr_1.2fr_1fr_1fr_auto] gap-6 border-b border-[#c9a45c]/10 px-6 py-4 text-xs uppercase tracking-wider text-[#81786d] md:grid">
            <span>Product</span>
            <span>Category</span>
            <span>Carat</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-[#81786d]">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-lg text-[#a9a093]">
                No products yet.
              </p>

              <p className="mt-2 text-sm text-[#756d62]">
                Click Add Product to create your first gemstone.
              </p>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="grid gap-5 border-b border-[#c9a45c]/10 px-6 py-6 last:border-b-0 md:grid-cols-[2fr_1.2fr_1fr_1fr_auto] md:items-center md:gap-6"
              >
                <div className="flex items-center gap-4">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#c9a45c]/15 text-xs text-[#756d62]">
                      No image
                    </div>
                  )}

                  <div>
                    <p className="text-base text-[#eee5d8]">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-[#756d62]">
                      {product.slug}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[#a59b8d]">
                  {product.category}
                </p>

                <p className="text-sm text-[#a59b8d]">
                  {product.carat || "—"}
                </p>

                <span
                  className={
                    "w-fit rounded-full px-3 py-1 text-xs " +
                    (product.status === "Available"
                      ? "bg-[#243c2b] text-[#a9c9ad]"
                      : "bg-[#3a3020] text-[#d7b56d]")
                  }
                >
                  {product.status}
                </span>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => openEditForm(product)}
                    className="text-sm text-[#d7b56d] transition hover:text-[#f0dca9]"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteProduct(product.id, product.name)
                    }
                    className="text-sm text-[#81786d] transition hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}