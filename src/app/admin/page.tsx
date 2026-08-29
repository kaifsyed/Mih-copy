import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { DiamondIcon, MailIcon, ArrowRightIcon } from "@/components/ui/icons";

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/admin");
  }

  // Defense in depth: the layout already gates /admin, but this page must not
  // rely on a parent to be safe on its own.
  if (!isAdmin(userId)) {
    redirect("/");
  }

  return (
    <div>
      <p className="eyebrow">MIH GEMS</p>
      <h1 className="mt-3 font-serif text-4xl text-ivory sm:text-5xl">
        Admin Dashboard
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
        Manage gemstones, enquiries and the MIH GEMS catalogue from one place.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        <Link
          href="/admin/products"
          className="card-luxe group flex flex-col gap-4 p-6"
        >
          <DiamondIcon className="h-7 w-7 text-gold" />
          <div>
            <h2 className="font-serif text-xl text-ivory transition-colors group-hover:text-gold">
              Products
            </h2>
            <p className="mt-2 text-sm text-muted">Add and manage gemstones</p>
          </div>
          <ArrowRightIcon className="mt-auto h-4 w-4 text-muted transition-colors group-hover:text-gold" />
        </Link>

        <Link
          href="/admin/enquiries"
          className="card-luxe group flex flex-col gap-4 p-6"
        >
          <MailIcon className="h-7 w-7 text-gold" />
          <div>
            <h2 className="font-serif text-xl text-ivory transition-colors group-hover:text-gold">
              Enquiries
            </h2>
            <p className="mt-2 text-sm text-muted">Manage customer enquiries</p>
          </div>
          <ArrowRightIcon className="mt-auto h-4 w-4 text-muted transition-colors group-hover:text-gold" />
        </Link>
      </div>

      <div className="card-luxe mt-8 p-7">
        <p className="text-[0.62rem] uppercase tracking-[0.25em] text-muted">
          Future capability
        </p>
        <h2 className="mt-3 font-serif text-xl text-ivory">
          Checkout &amp; Payments
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          The architecture will remain ready for a future checkout and payment
          gateway. For now, customer purchases continue through WhatsApp
          enquiries.
        </p>
      </div>
    </div>
  );
}