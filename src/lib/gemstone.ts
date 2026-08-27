import type { Product } from "@/lib/products";

/**
 * Deterministic gemstone-toned gradient used as an image fallback wherever a
 * product has no photo yet. Keeps the grid visually consistent without
 * fabricating imagery.
 */
export function gemstoneGradient(color: Product["color"]): string {
  switch (color) {
    case "blue":
      return "radial-gradient(120% 120% at 30% 20%, #3f6fa3 0%, #1e3a5f 45%, #0b1f3a 100%)";
    case "red":
      return "radial-gradient(120% 120% at 30% 20%, #a32f3f 0%, #6e1420 45%, #3a0b12 100%)";
    case "green":
      return "radial-gradient(120% 120% at 30% 20%, #2f8a5f 0%, #144e34 45%, #0b2a1c 100%)";
    default:
      return "radial-gradient(120% 120% at 30% 20%, #35352d 0%, #2a2b23 45%, #1b1c15 100%)";
  }
}
