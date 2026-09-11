"use client";

import {
  ShieldIcon,
  DiamondIcon,
  SparkleIcon,
  GlobeIcon,
} from "@/components/ui/icons";

const TRUST_ITEMS = [
  { label: "100% Genuine", Icon: ShieldIcon },
  { label: "Premium Quality", Icon: DiamondIcon },
  { label: "Retail & Custom", Icon: SparkleIcon },
  { label: "Worldwide Shipping", Icon: GlobeIcon },
] as const;

const REPEAT_COUNT = 4;

export function TrustMarquee() {
  return (
    <div className="marquee-track" aria-label="MIH GEMS trust highlights">
      <div className="marquee-content">
        {Array.from({ length: REPEAT_COUNT }, (_, groupIndex) => (
          <div key={groupIndex} className="marquee-group">
            {TRUST_ITEMS.map(({ label, Icon }) => (
              <span key={label} className="marquee-item">
                <Icon className="marquee-icon" />
                {label}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
