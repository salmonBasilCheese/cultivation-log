# Design System

## Core Philosophy

- **Natural & Premium**: Colors inspired by soil, leaves, and sunlight. High contrast but soothing.
- **Mobile First**: Large touch targets (min 44px).
- **Glassmorphism**: Subtle transparency for depth.

## Color Palette (CSS Variables)

```css
:root {
  /* Primary Brand (Growth Green) */
  --color-primary: #2d6a4f; /* Deep Forest Green */
  --color-primary-light: #40916c; /* Leaf Green */
  --color-accent: #d8f3dc; /* Pale Sprout */

  /* Earth Tones (Backgrounds) */
  --color-bg-main: #f4f6f5; /* Off-white mist */
  --color-bg-card: #ffffff; /* Pure White */
  --color-text-main: #1b4332; /* Dark Green Black */
  --color-text-sub: #74c69d; /* Muted Green */

  /* Functional */
  --color-danger: #e63946; /* Alert Red */
  --color-warning: #ffb703; /* Sun Yellow */
  --shadow-card: 0 4px 12px rgba(45, 106, 79, 0.1);
}
```

## Typography

- **Font Family**: 'Inter', system-ui, sans-serif
- **Headings**:
  - H1: 24px (Bold) - Page Titles
  - H2: 20px (SemiBold) - Section Headers
- **Body**: 16px (Regular) - Readability focus

## Component Tokens

### Buttons

- **Primary**: `bg-primary`, `text-white`, `rounded-full`
- **Secondary**: `bg-accent`, `text-primary`, `rounded-full`

### Cards

- **Radius**: `16px`
- **Padding**: `16px`
- **Effect**: Glass backdrop blur (optional)
