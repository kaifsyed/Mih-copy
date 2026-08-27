import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/admin");
  }

  return (
    <main className="min-h-screen bg-[#0b0a09] text-[#f5efe5]">
      <header className="border-b border-[#c9a45c]/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <a href="/" className="text-xl font-semibold tracking-[0.25em]">
            MIH GEMS
          </a>

          <a
            href="/"
            className="text-sm text-[#a59b8d] transition hover:text-[#d7b56d]"
          >
            Back to website
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#d7b56d]">
            MIH GEMS
          </p>

          <h1 className="mt-3 text-4xl font-light sm:text-5xl">
            Admin Dashboard
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9f9689]">
            Manage gemstones, enquiries, customers and the MIH GEMS
            catalogue from one place.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/products"
            className="rounded-2xl border border-[#c9a45c]/15 bg-[#100f0d] p-6 transition hover:border-[#d7b56d]/50"
          >
            <p className="text-3xl">💎</p>
            <h2 className="mt-5 text-lg">Products</h2>
            <p className="mt-2 text-sm text-[#81786d]">
              Add and manage gemstones
            </p>
          </a>

          <a
            href="/admin/categories"
            className="rounded-2xl border border-[#c9a45c]/15 bg-[#100f0d] p-6 transition hover:border-[#d7b56d]/50"
          >
            <p className="text-3xl">◈</p>
            <h2 className="mt-5 text-lg">Categories</h2>
            <p className="mt-2 text-sm text-[#81786d]">
              Organise your collections
            </p>
          </a>

          <a
            href="/admin/enquiries"
            className="rounded-2xl border border-[#c9a45c]/15 bg-[#100f0d] p-6 transition hover:border-[#d7b56d]/50"
          >
            <p className="text-3xl">💬</p>
            <h2 className="mt-5 text-lg">Enquiries</h2>
            <p className="mt-2 text-sm text-[#81786d]">
              Manage customer enquiries
            </p>
          </a>

          <a
            href="/admin/customers"
            className="rounded-2xl border border-[#c9a45c]/15 bg-[#100f0d] p-6 transition hover:border-[#d7b56d]/50"
          >
            <p className="text-3xl">👤</p>
            <h2 className="mt-5 text-lg">Customers</h2>
            <p className="mt-2 text-sm text-[#81786d]">
              View registered customers
            </p>
          </a>
        </div>

        <div className="mt-8 rounded-2xl border border-[#c9a45c]/15 bg-[#100f0d] p-7">
          <p className="text-xs uppercase tracking-[0.25em] text-[#81786d]">
            Future capability
          </p>

          <h2 className="mt-3 text-xl font-light">
            Checkout & Payments
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#81786d]">
            The architecture will remain ready for a future checkout and
            payment gateway. For now, customer purchases continue through
            WhatsApp enquiries.
          </p>
        </div>
      </section>
    </main>
  );
}