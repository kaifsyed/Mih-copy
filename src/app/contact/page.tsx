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
  MapPinIcon,
  ExternalLinkIcon,
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

const GOOGLE_MAPS_URL = "https://www.google.com/maps?q=13.4871175,77.4582173";

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
        description="Questions about a piece, a commission, an appointment or a partnership. We're happy to help. Send an enquiry below or message us directly on WhatsApp."
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
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold btn-sm"
                >
                  <MapPinIcon className="h-4 w-4" />
                  View on Google Maps
                  <ExternalLinkIcon className="h-4 w-4" />
                </a>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
                >
                  <span className="text-[0.62rem] uppercase tracking-[0.18em]">
                    Get Directions
                  </span>
                  <ArrowRightIcon className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </a>
              </div>
            </div>
          ) : null}
        </aside>

        {/* Form */}
        <div className="lg:col-span-7">
          <EnquiryForm config={CONTACT_FORM} />
        </div>
      </div>

      {/* Our Location */}
      <section className="mt-20 border-t border-outline/15 pt-16">
        <div className="mb-10 text-center">
          <p className="eyebrow">Our Location</p>
          <h2 className="mt-4 font-serif text-3xl text-ivory sm:text-4xl">
            Find us
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Visit MIH GEMS to explore our curated collection of natural gemstones and fine jewellery.
          </p>
        </div>
        <div className="card-luxe overflow-hidden">
          <div className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3879.788643396277!2d77.4582173!3d13.4871175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb1c5a94aeae7f3%3A0xe802f0e15bbc1752!2sMIH%20GEMS!5e0!3m2!1sen!2sin!4v1792930304963!5m2!1sen!2sin"
              title="MIH GEMS business location on Google Maps"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
              width="100%"
              height="100%"
            />
          </div>
        </div>
      </section>

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
