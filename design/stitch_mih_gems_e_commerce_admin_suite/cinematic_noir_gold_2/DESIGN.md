---
name: Cinematic Noir Gold
colors:
  surface: '#13140d'
  surface-dim: '#13140d'
  surface-bright: '#393a31'
  surface-container-lowest: '#0e0f08'
  surface-container-low: '#1b1c15'
  surface-container: '#1f2019'
  surface-container-high: '#2a2b23'
  surface-container-highest: '#35352d'
  on-surface: '#e4e3d7'
  on-surface-variant: '#c5c7c2'
  inverse-surface: '#e4e3d7'
  inverse-on-surface: '#303129'
  outline: '#8f918d'
  outline-variant: '#454744'
  surface-tint: '#c9c6c5'
  primary: '#e5e2e1'
  on-primary: '#313030'
  primary-container: '#c9c6c5'
  on-primary-container: '#535252'
  inverse-primary: '#5f5e5d'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#ae8d10'
  on-secondary-container: '#342800'
  tertiary: '#e4e3d8'
  on-tertiary: '#303129'
  tertiary-container: '#c8c7bc'
  on-tertiary-container: '#52534a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c9c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#ffe087'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#231a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e4e3d7'
  tertiary-fixed-dim: '#c8c7bc'
  on-tertiary-fixed: '#1b1c15'
  on-tertiary-fixed-variant: '#47473f'
  background: '#13140d'
  on-background: '#e4e3d7'
  surface-variant: '#35352d'
  surface-noir: '#13140d'
  surface-charcoal: '#1b1c15'
  champagne-gold: '#e9c349'
  metallic-gold: '#b8860b'
  ivory-on-surface: '#e4e3d7'
  platinum-silver: '#c9c6c5'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.15em
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.1em
spacing:
  base: 8px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  section-gap: 120px
  container-max: 1440px
---

## Brand & Style

This design system is anchored in a "Cinematic Noir" narrative, positioning the product as a curator of high-end artifacts and rare gemstones. The brand personality is mysterious, authoritative, and deeply luxurious, catering to high-net-worth collectors who value exclusivity and the emotional weight of a timeless piece.

The visual style is a sophisticated blend of **Minimalism** and **Glassmorphism**, elevated by sharp, architectural lines. We utilize "blackspace" to allow high-fidelity photography to breathe, mimicking the atmosphere of a private gallery at night. The interface relies on cinematic lighting—subtle radial glows and metallic reflections—to create a sense of opulence and physical depth. Every interaction should feel intentional and quiet, emphasizing the sparkle of the product against a muted, dark canvas.

## Colors

The palette is dominated by a foundation of "Noir" and "Charcoal" to create a dramatic, infinite backdrop. This allows the high-contrast accents to function as precision tools for hierarchy.

- **Primary (Platinum Silver):** Used for primary text and structural lines, offering a cool, refined contrast to the dark base.
- **Secondary (Champagne Gold):** Reserved for primary actions, decorative flourishes, and thin brand-defining borders.
- **Surface Noir:** The primary background color, ensuring maximum depth and focus on imagery.
- **Surface Charcoal:** Used for containers and cards to create subtle tonal separation from the background.
- **Ivory:** Employed sparingly for editorial content to provide a soft, legible alternative to pure white.

## Typography

Typography follows a classic editorial hierarchy, balancing the serif authority of **Playfair Display** with the modern, functional clarity of **Montserrat**.

- **Headlines:** Always high-contrast (Ivory or Silver on Noir). Use wide tracking for display sizes to evoke an "expensive" editorial feel.
- **Body:** Montserrat ensures legibility at smaller sizes. Maintain generous line heights to ensure readability against dark backgrounds.
- **Labels & Navigation:** Always uppercase with increased letter-spacing. This evokes a sense of professional cataloging and diamond certification labeling.

## Layout & Spacing

This design system utilizes a **fixed-grid** model for desktop to maintain a "boutique" aesthetic, transitioning to a fluid model for mobile devices.

- **Grid:** A 12-column system with 24px gutters. Content should be framed by wide 80px margins on desktop to simulate a high-end lookbook.
- **Rhythm:** We use a strict 8px base unit. Vertical spacing between major sections is intentionally aggressive (120px+) to emphasize the premium nature of the brand.
- **Mobile Adaptivity:** Margins shrink to 20px, and grid columns collapse to a 1 or 2-column view. On mobile, prioritize large imagery over information density.

## Elevation & Depth

Hierarchy is established through tonal layering and light manipulation rather than traditional shadows.

- **Tonal Layers:** The base surface is `#13140d`. Containers use `#1b1c15` with a 1px Gold or Silver border to define edges.
- **Glassmorphism:** Navigation bars and modal overlays use a 20% opacity charcoal fill with a heavy 20px backdrop blur, creating a "smoked glass" effect.
- **Light Accents:** Primary buttons and featured gemstones utilize a very soft, low-opacity radial glow (Champagne Gold at 10% opacity) to simulate the "sparkle" of jewelry under spotlighting.
- **Outlines:** Use "ghost borders"—1px Gold lines at 30% opacity—to define cards and input fields without adding visual weight.

## Shapes

The shape language is strictly **Sharp (0)**. To reflect the precision cut of diamonds and architectural integrity of fine jewelry, the UI avoids rounded corners entirely.

- **Containers & Buttons:** Must maintain 90-degree corners.
- **Borders:** All primary containers feature a 1px solid border in Gold or Charcoal, reinforcing the "framed" aesthetic. 
- **Functional Exceptions:** Only inner interactive indicators (like the center of a radio button) may be circular, but their containers must remain sharp.

## Components

### Buttons
- **Primary:** Solid Champagne Gold with Noir text. Sharp corners.
- **Secondary:** Ghost style. 1px Gold border, transparent background, Gold text.
- **Interaction:** Hovering on a primary button should trigger a transition to Metallic Gold with a subtle outer gold glow.

### Cards (Product & Gemstone)
- **Background:** Surface Charcoal.
- **Border:** 1px subtle Silver outline that brightens to Gold on hover.
- **Imagery:** Photography should feature deep shadows and hard directional lighting.

### Input Fields
- **Style:** Underline only or 1px Charcoal border.
- **Focus:** Border transitions to Champagne Gold. Labels float above in uppercase Montserrat (label-sm).

### Navigation & Menus
- **Top Bar:** Smoked glass treatment (60% Charcoal with 20px blur).
- **Cart/Drawer:** Slides in from the right, utilizing the same smoked glass treatment to maintain cinematic depth.

### Chips & Badges
- Used for attributes like "GIA Certified" or "Rare." 
- Sharp-edged boxes with 1px Silver borders and tracked-out Montserrat text.