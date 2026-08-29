import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import EnquiryForm from "@/components/enquiry/enquiry-form";
import { CONTACT_FORM } from "@/components/enquiry/enquiry-fields";
import { CONTACT } from "@/lib/contact";
import { whatsappLink, hasWhatsapp } from "@/lib/whatsapp";
import {
  MailIcon,
  PhoneIcon,
  WhatsappIcon,
  ArrowRightIcon,
  SparkleIcon,
  DiamondIcon,
  InstagramIcon,
  FacebookIcon,
} from "@/components/ui/icons";
import { SOCIAL_LINKS } from "@/lib/site";

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
} as const;

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with MIH GEMS about gemstones, custom jewellery, appointments or wholesale. Send an enquiry or reach us on WhatsApp.",
};

const GENERAL_WHATSAPP =
  "Hi MIH GEMS, I'd like to get in touch about your gemstones and jewellery.";

const CROSS_LINKS = [
  {
    href: "/custom-jewellery",
    icon: SparkleIcon,
    title: "Custom jewellery",
    body: "Begin the journey of creating a bespoke piece, designed around you.",
  },
  {
    href: "/wholesale",
    icon: DiamondIcon,
    title: "Wholesale",
    body: "Partner with us to source gemstones and silver jewellery for your business.",
  },
] as const;

export default function ContactPage() {
  return (
    <div className="container-luxe section-gap">
      <SectionHeading
        as="h1"
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about a piece, a commission, an appointment or a partnership — we're happy to help. Send an enquiry below or message us directly on WhatsApp."
      />

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Details */}
        <aside className="flex flex-col gap-6 lg:col-span-5">
          <div className="card-luxe p-8">
            <h2 className="font-serif text-2xl text-ivory">Reach us</h2>
            <div className="divider-gold mt-4" />
            <ul className="mt-6 flex flex-col gap-5 text-sm">
              <li>
                <a
                  href={whatsappLink(GENERAL_WHATSAPP)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-gold/30 text-whatsapp">
                    <WhatsappIcon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                      WhatsApp
                    </span>
                    <span className="mt-0.5 block text-ivory transition-colors group-hover:text-gold">
                      {hasWhatsapp() ? "Message us on WhatsApp" : "Open WhatsApp"}
                    </span>
                  </span>
                </a>
              </li>

              {CONTACT.email ? (
                <li>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="group flex items-start gap-4"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-gold/30 text-gold">
                      <MailIcon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                        Email
                      </span>
                      <span className="mt-0.5 block break-all text-ivory transition-colors group-hover:text-gold">
                        {CONTACT.email}
                      </span>
                    </span>
                  </a>
                </li>
              ) : null}

              {CONTACT.phone ? (
                <li className="flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-gold/30 text-gold">
                    <PhoneIcon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                      Phone
                    </span>
                    <a
                      href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
                      className="mt-0.5 block text-ivory transition-colors hover:text-gold"
                    >
                      {CONTACT.phone}
                    </a>
                  </span>
                </li>
              ) : null}
            </ul>

            {/* Social profiles */}
            <div className="mt-7 border-t border-outline/12 pt-6">
              <span className="block text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                Follow us
              </span>
              <div className="mt-3 flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = SOCIAL_ICONS[social.key];
                  return (
                    <a
                      key={social.key}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="inline-flex h-10 w-10 items-center justify-center border border-gold/30 text-ivory transition-colors hover:border-gold/60 hover:text-gold"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {CONTACT.address || CONTACT.hours ? (
            <div className="card-luxe p-8">
              <h2 className="font-serif text-xl text-ivory">Visit</h2>
              <div className="divider-gold mt-4" />
              {CONTACT.address ? (
                <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-muted">
                  {CONTACT.address}
                </p>
              ) : null}
              {CONTACT.hours ? (
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">
                  {CONTACT.hours}
                </p>
              ) : null}
            </div>
          ) : null}
        </aside>

        {/* Form */}
        <div className="lg:col-span-7">
          <EnquiryForm config={CONTACT_FORM} />
        </div>
      </div>

      {/* Cross-links */}
      <div className="mt-20 grid grid-cols-1 gap-6 border-t border-outline/15 pt-16 sm:grid-cols-2">
        {CROSS_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="card-luxe group flex items-center gap-5 p-8 transition-colors hover:border-gold/40"
          >
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center border border-gold/30 text-gold">
              <link.icon className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <h3 className="font-serif text-xl text-ivory transition-colors group-hover:text-gold">
                {link.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {link.body}
              </p>
            </div>
            <ArrowRightIcon className="h-5 w-5 shrink-0 text-outline transition-colors group-hover:text-gold" />
          </Link>
        ))}
      </div>
    </div>
  );
}
