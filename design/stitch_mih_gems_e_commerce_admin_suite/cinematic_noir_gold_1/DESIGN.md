---
name: Cinematic Noir Gold
colors:
  surface: '#13140d'
  surface-dim: '#13140d'
  surface-bright: '#393a32'
  surface-container-lowest: '#0d0f08'
  surface-container-low: '#1b1c15'
  surface-container: '#1f2019'
  surface-container-high: '#292b23'
  surface-container-highest: '#34352e'
  on-surface: '#e4e3d7'
  on-surface-variant: '#c4c7c7'
  inverse-surface: '#e4e3d7'
  inverse-on-surface: '#303129'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c9c6c5'
  primary: '#c9c6c5'
  on-primary: '#313030'
  primary-container: '#0a0a0a'
  on-primary-container: '#7b7979'
  inverse-primary: '#5f5e5e'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#c8c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#0a0a0a'
  on-tertiary-container: '#7a7979'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c9c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#13140d'
  on-background: '#e4e3d7'
  surface-variant: '#34352e'
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
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
---

## Brand & Style

The design system is rooted in the "Cinematic Noir & Gold" aesthetic, positioning the brand as a purveyor of high-end, rare artifacts rather than just retail products. The brand personality is mysterious, authoritative, and deeply luxurious. It targets high-net-worth individuals and collectors who value craftsmanship and the emotional weight of a timeless piece.

The visual style is a sophisticated blend of **Minimalism** and **Glassmorphism**, elevated by tactile, high-contrast elements. We utilize heavy whitespace (or "blackspace") to allow high-fidelity gemstone photography to breathe. Cinematic lighting is achieved through subtle radial gradients that mimic spotlighting on a dark stage. The interface should feel like a curated gallery at night—quiet, focused, and opulent.

## Colors

The palette is dominated by a "Deep Black" and "Charcoal" foundation to create a dramatic, infinite backdrop. This allows the "Champagne Gold" to act as a precision tool for hierarchy and brand recognition.

- **Primary & Tertiary:** Used for the main canvas and structural containers.
- **Accents (Gold):** Reserved for primary actions, thin borders, and decorative flourishes. Metallic Gold is used for hover states and interactive depth.
- **Surfaces (Warm Ivory):** Used sparingly for high-contrast storytelling sections or editorial-style lookbooks to provide visual relief from the dark mode.
- **Gemstone Support:** These colors are strictly functional, used for category tagging or to complement product photography without overpowering the gold branding.

## Typography

Typography follows a classic editorial hierarchy. **Playfair Display** provides the elegance and "serif" authority required for headlines, while **Montserrat** ensures the UI remains modern, legible, and functional.

- **Headlines:** Use wide tracking for a more "expensive" feel. Large display sizes should always be high-contrast (Ivory on Black).
- **Body:** Montserrat is used for all descriptive text. Maintain generous line heights to ensure readability against dark backgrounds.
- **Labels:** Always use uppercase with increased letter-spacing for navigation items, buttons, and sub-headers to evoke a sense of professional labeling and cataloging.

## Layout & Spacing

This design system utilizes a **fixed-grid** model for desktop to maintain the "luxury boutique" feel, transitioning to a fluid model for mobile devices. 

- **Grid:** A 12-column system with 24px gutters. Content is centered with wide margins (80px) to simulate a frame.
- **Rhythm:** We use a strict 8px base unit. Spacing between sections should be aggressive (minimum 120px on desktop) to emphasize the premium nature of the brand.
- **Mobile Reflow:** On mobile, margins shrink to 20px, and grid columns collapse to a 2-column or single-column view. Multi-column lists (like product grids) should prioritize image size over information density.

## Elevation & Depth

Hierarchy is established through **Glassmorphism** and **Tonal Layers** rather than heavy shadows.

- **The Base:** #0A0A0A (Black).
- **The Container:** #1A1A1A (Charcoal) with a 1px Champagne Gold border.
- **Glassmorphism:** Navigation bars and modal overlays use a 20% opacity Charcoal fill with a 20px backdrop blur. This creates a "smoked glass" effect that keeps the focus on the product behind it.
- **Glows:** Primary buttons and featured gemstones utilize a very soft, low-opacity radial glow (#D4AF37 at 10% opacity) to simulate spotlighting and "the sparkle" of jewelry.
- **Outlines:** Instead of drop shadows, use 1px Gold borders (#D4AF37) at 30-50% opacity to define the edges of cards and inputs.

## Shapes

The shape language is **Sharp (0)**. To reflect the precision cut of diamonds and gemstones, the UI avoids rounded corners. Sharp edges convey discipline, luxury, and architectural integrity. 

- **Exceptions:** Very small functional elements (like radio button inner dots) may be circular, but all containers, buttons, and input fields must maintain 90-degree corners.
- **Borders:** All primary containers should feature a 1px solid border in Champagne Gold or a subtle Charcoal, reinforcing the "framed" aesthetic.

## Components

### Buttons
- **Primary:** Solid Champagne Gold (#D4AF37) with Black text (#0A0A0A). Sharp corners. No shadows.
- **Secondary:** Ghost style. 1px Gold border, transparent background, Gold text. 
- **Interaction:** On hover, primary buttons transition to Metallic Gold (#B8860B) with a subtle outer gold glow.

### Cards (Product & Gemstone)
- **Background:** Charcoal (#1A1A1A).
- **Border:** 1px subtle Gold outline that brightens on hover.
- **Typography:** Product titles in Playfair Display, prices in Montserrat.

### Input Fields
- **Style:** Underline only or 1px Charcoal border. 
- **Focus:** Border transitions to Champagne Gold. Labels float above in Montserrat (Label-sm).

### Navigation
- **Top Bar:** Smoked glass effect (Charcoal at 60% with blur). 
- **Links:** Montserrat (Label-md) in Ivory, transitioning to Gold on hover.

### Chips & Tags
- Used for gemstone attributes (e.g., "GIA Certified").
- Small, sharp-edged boxes with 1px Charcoal borders and uppercase Montserrat text.

### Interactive Overlays
- Cart drawers and menus should slide in from the right, utilizing the same smoked glass treatment to maintain cinematic depth.