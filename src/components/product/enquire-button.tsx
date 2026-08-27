import type { Product } from "@/lib/products";
import { formatPrice, isEnquiryOnly } from "@/lib/pricing";
import { whatsappLink, productEnquiryMessage } from "@/lib/whatsapp";
import { WhatsappIcon } from "@/components/ui/icons";

type EnquireButtonProps = {
  product: Pick<
    Product,
    "name" | "pricing_type" | "price" | "price_min" | "price_max"
  >;
  className?: string;
  label?: string;
};

/**
 * WhatsApp enquiry CTA for a single product. The prefilled message includes the
 * customer-facing price text (never a raw number when the piece is
 * enquiry-only, and never a database ID).
 */
export function EnquireButton({
  product,
  className = "",
  label = "Enquire on WhatsApp",
}: EnquireButtonProps) {
  const priceText = isEnquiryOnly(product) ? undefined : formatPrice(product);
  const message = productEnquiryMessage(product.name ?? "this piece", priceText);

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-whatsapp ${className}`}
    >
      <WhatsappIcon className="h-4 w-4" />
      {label}
    </a>
  );
}
