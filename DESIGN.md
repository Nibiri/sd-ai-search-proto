# Design System: LogicBPM

## 1. Visual Theme & Atmosphere

LogicBPM is a B2B business-process management platform built for support agents and operations teams who live in the interface all day. The design operates on a foundation of cool white (`#ffffff`) and a soft page background (`#f3f4f5`) with a single purple accent — `#845cdd` — that carries all interactive meaning. Everything else defers to a disciplined gray scale.

The typography is set exclusively in Inter — a typeface chosen for its pixel-sharp rendering at small sizes and neutral, professional character. Headings run at weight 600; body text at 400. There is no italic, no decorative type, no mixing of families. The voice is structured and calm: an interface you trust with real work.

What distinguishes LogicBPM is its deliberate restraint. Cards surface on the page with nothing more than a 1px gray border and a whisper of shadow. The purple appears only on buttons, active states, links, and status accents — never as a background fill on large surfaces. The result is a workspace that reads like a well-organised document: scannable, dense but not crowded, and completely free of visual noise.

**Key Characteristics:**
- Page background `#f3f4f5` (gray-3), card surfaces pure white `#ffffff`
- Single brand accent: Purple `#845cdd` — used only for primary actions and active states
- Inter exclusively — weights 400 (text) and 600 (headings), never below 400, never above 600 in body context
- 1px `#e8eaeb` borders on all cards — no shadow-only elevation at rest
- Flat buttons — no box-shadow, no gradients
- `border-radius: 16px` on buttons and cards; `8px` on inputs and chips; `9999px` on avatars and counters
- Status badges via color-coded chips — never raw colored text
- B2B density: 4 cards per row at desktop, comfortable but not airy

## 2. Color Palette & Roles

### Brand: Purple Scale
- **Purple 1** (`#f3effc`): hover backgrounds, tinted surfaces, secondary button bg
- **Purple 2** (`#e1d8f7`): secondary button hover
- **Purple 3** (`#cab9f0`): focus rings (alternative)
- **Purple 5** (`#9a79e3`): focus ring on inputs
- **Purple 6** (`#845cdd`): `--button-primary`, `--text-accent` — primary action color
- **Purple 7** (`#704ebc`): `--button-primary-hover` — primary hover
- **Purple 8** (`#5e419d`): active state text on tinted bg

### Neutral: Gray Scale
- **Gray 1** (`#ffffff`): card background, modal background, input background (white)
- **Gray 2** (`#f9fbfc`): input default background
- **Gray 3** (`#f3f4f5`): `--background-primary-medium` — page background
- **Gray 4** (`#e8eaeb`): `--border-low` — card and divider borders
- **Gray 5** (`#d7d8d9`): `--border-high` — strong borders, disabled outlines
- **Gray 6** (`#bdbebf`): `--text-inactive` — placeholder, disabled text
- **Gray 7** (`#8c8c8c`): `--text-secondary` — metadata, labels, timestamps
- **Gray 9** (`#333333`): body copy
- **Gray 10** (`#242526`): `--text-primary` — primary text
- **Gray 12** (`#111314`): logo text, maximum contrast

### Semantic
- **Red 1** (`#f8e9ef`): error background tint
- **Red 6** (`#b91e5a`): `--text-error`, `--button-primary-error` — destructive actions, error state
- **Green 1** (`#eefbf1`): success background tint
- **Green 6** (`#56d672`): `--badge-green-content` — active status dot
- **Green 7** (`#49b661`): accept action, success text
- **Orange 1** (`#fffaef`): warning background tint
- **Orange 6** (`#f79009`): `--text-warning` — warning state, overdue SLA
- **Yellow 6** (`#ffcc5f`): starred/bookmarked item accent
- **Blue 5** (`#5f6ce2`): `--text-link` — hyperlinks

### CSS Custom Properties (runtime tokens)
```css
--text-primary:             #242526
--text-secondary:           #8c8c8c
--text-inactive:            #bdbebf
--text-accent:              #845cdd
--text-error:               #b91e5a
--text-warning:             #f79009
--background-primary-medium: #f3f4f5
--background-secondary:      #ffffff
--border-low:               #e8eaeb
--border-high:              #d7d8d9
--button-primary:           #845cdd
--button-primary-hover:     #704ebc
```

## 3. Typography Rules

### Font Family
- **Primary**: `Inter`, fallback: `-apple-system, BlinkMacSystemFont, system-ui, sans-serif`
- No custom or display typeface. No serif. No monospace in UI (only in code blocks).

### Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|--------|-------------|----------------|-------|
| XL Heading | 24px | 600 | 1.3 | normal | Page titles |
| L Heading | 20px | 600 | 1.3 | normal | Section headings |
| M Heading | 16px | 600 | 1.4 | normal | Card titles, modal headers |
| S Body | 14px | 400 | 1.5 | normal | **Default body text** |
| XS Label | 13px | 400 | 1.4 | normal | Secondary labels, metadata |
| Micro Caption | 11px | 400 | 1.4 | normal | Timestamps, hints, captions |
| Link | 14px | 400 | 1.5 | normal | Color `#5f6ce2`, underline on hover |

**Rules:**
- Minimum font-size: 11px — never go below
- `text-transform: none` everywhere — no uppercase labels, no uppercase buttons
- Weight 500 only for UI emphasis (button text, nav items) — not for headings
- Monospace (`JetBrains Mono, Fira Code`) only for code snippets and developer content

## 4. Component Stylings

### Buttons
```
Height:        40px
Border-radius: 16px
Font:          Inter 16px / 20px, weight 400
Padding:       8px 20px
Box-shadow:    none (flat)
Transition:    background 0.3s ease
Icon gap:      8px
```

| Variant | Background | Text | Hover |
|---------|-----------|------|-------|
| `primary` | `#845cdd` | white | `#704ebc` |
| `secondary` | `#f3effc` | `#845cdd` | `#e1d8f7` |
| `tertiary` | transparent | `#242526` | `#f3f4f5` |
| `operation` | rgba(0,0,0,5%) | `#242526` | rgba(0,0,0,10%) |
| `link` | transparent | `#845cdd` | `#f3effc` |
| `primaryError` | `#b91e5a` | white | `#9c1a4c` |
| `secondaryError` | `#f8e9ef` | `#b91e5a` | `#f0d0dd` |
| `secondaryAccept` | `#eefbf1` | `#49b661` | `#d8f5de` |

Disabled: background `#e8eaeb`, text `#bdbebf`, cursor not-allowed.

### Inputs
```
Height:        40px
Border-radius: 8px
Background:    #f9fbfc (gray-2)
Border:        1px solid #e8eaeb (default)
              1px solid #9a79e3 (focus)
              1px solid #b91e5a (error)
              1px solid #f79009 (warning)
Font:          Inter 14px
Padding:       8px 12px
Transition:    border-color 0.2s
```

### Cards / CardBlock
```
Border-radius: 16px (default), 28px (feature)
Background:    #ffffff
Border:        1px solid #e8eaeb
Box-shadow:    0px 1px 2px 0px rgba(16,24,40,0.05)
Padding:       16px (default), 24px (spacious)
Top accent:    2px solid [entity color] — for ticket cards only
```

### Status Badges
All statuses rendered via `Badge` component — never raw colored text.
```
Height:  24px (small), 32px, 40px
Radius:  6px
Font:    12–13px, weight 500
```
Entity type colors for card top border: Problem `#b91e5a` · Complaint `#f79009` · Request `#845cdd` · Appeal `#49b661`

### Tabs
- `horizontal` — underline indicator, gray-7 inactive → gray-10 + purple-6 underline active
- `deep` — pill style, active gets `#f3effc` background + purple border

### Avatars (UserAvatar)
```
Shape:       circle (border-radius: 50%)
Sizes:       24 / 32 / 40 / 100px
Default bg:  derived from name hash (purple family)
Text:        Inter bold, white
Status dot:  10px circle, white 2px border, bottom-right
  active → #56d672  busy → #b91e5a  break → #ffcc5f
```

### Navigation Item
```
Padding:     8px 12px
Radius:      18px
Active:      bg #f3effc, text #5e419d, icon filled
Inactive:    transparent, text #8c8c8c
Hover:       bg #f3f4f5 (inactive), bg #e1d8f7 (active)
Transition:  background 0.2s
```

### Chat Bubbles
```
Outgoing (client):  bg #845cdd, white text, radius 16px 16px 4px 16px
Incoming (support): bg #f3f4f5, gray-10 text, radius 16px 16px 16px 4px
Incoming (AI):      bg #f3effc, gray-10 text, same radius as support
Max-width:  68% of container
Avatar:     28px circle, aligned flex-start (top of group)
Timestamp:  11px, gray-6, below bubble
```

## 5. Layout Principles

### Spacing Scale (4px base)
```
4px  · micro gap (icon + label)
8px  · tight (within component)
12px · medium (between related elements)
16px · default card padding
20px · button horizontal padding
24px · section padding
32px · between sections
48px · large section breaks
```

### Page Structure
```
App bar:      56px, white bg, 1px bottom border #e8eaeb, sticky
Sidebar:      340px fixed, white bg, 1px right border #e8eaeb
Content:      flex-grow, bg #f3f4f5
Page padding: 24px desktop, 16px mobile
```

### Grid
- Ticket/card grid: `xs:12 sm:6 md:4 lg:3` (4-per-row at desktop)
- Split layout (messaging): 340px sidebar + flex-grow main
- Max content width: 960px on doc/showcase pages

### Whitespace Philosophy
B2B density — comfortable but never airy. Every surface earns its space. Padding of 16px inside cards, 24px between sections. No decorative whitespace added for "breathing room."

## 6. Depth & Elevation

| Level | Value | Use case |
|-------|-------|----------|
| Flat | no shadow | Page background, text blocks |
| XS | `0px 1px 2px 0px rgba(16,24,40,0.05)` | Cards at rest, default state |
| SM | `0px 1px 3px rgba(16,24,40,0.10), 0px 1px 2px rgba(16,24,40,0.06)` | Dropdowns, tooltips |
| MD | `0px 4px 8px -2px rgba(16,24,40,0.10), 0px 2px 4px -2px rgba(16,24,40,0.06)` | Modals, popovers, card hover |
| LG | `0px 12px 16px -4px rgba(16,24,40,0.08), 0px 4px 6px -2px rgba(16,24,40,0.03)` | Floating panels |

**Shadow philosophy**: Cards sit 1px above the page via border + shadow-xs — not by changing background color. Hover state lifts to shadow-md with a subtle `translateY(-2px)`. Modals use shadow-md, never shadow-lg (the overlay handles visual separation).

## 7. Do's and Don'ts

### Do
- Use `#845cdd` for all primary interactive actions
- Use `#f3f4f5` as page background, `#ffffff` for card surfaces
- Apply `border-radius: 16px` to cards and buttons, `8px` to inputs and chips
- Keep all text `text-transform: none` — buttons, labels, headings
- Align avatars to `flex-start` in chat and list items
- Render all statuses via `Badge` component with semantic color
- Show "Не определён" / "Не назначен" in gray-6 — never leave cells empty
- Format dates as `dd.MM.yyyy HH:mm` with date-fns ru locale
- Place toasts bottom-center, auto-close 5000ms

### Don't
- Don't put `box-shadow` on buttons — they are flat
- Don't use purple as a large background fill — accent only
- Don't mix purple and blue accents on the same surface
- Don't use `text-transform: uppercase` anywhere in the UI
- Don't use font sizes below 11px
- Don't stack an unread count and a status badge in the same position
- Don't exceed `border-radius: 28px` except full-pill (`9999px`)
- Don't use more than 2 typeface weights on a single surface

## 8. Responsive Behavior

| Breakpoint | Width | Key Changes |
|-----------|-------|-------------|
| xs | 0px | Single column, full-width cards, sidebar hidden |
| sm | 600px | 2-column card grid, sidebar as bottom-sheet |
| md | 900px | 3-column card grid |
| lg | 1200px | 4-column grid, sidebar always visible (340px) |

- Touch targets: minimum 40×40px
- App bar: 56px at all breakpoints
- Sidebar in split view: drawer/bottom-sheet on mobile, fixed panel on desktop
- Card grid: 4 → 3 → 2 → 1 columns as viewport narrows

## 9. Agent Prompt Guide

### Quick Color Reference
```
Primary action:    #845cdd  (purple-6)
Primary hover:     #704ebc  (purple-7)
Page bg:           #f3f4f5  (gray-3)
Card bg:           #ffffff
Border:            #e8eaeb  (gray-4)
Primary text:      #242526  (gray-10)
Secondary text:    #8c8c8c  (gray-7)
Inactive text:     #bdbebf  (gray-6)
Error:             #b91e5a  (red-6)
Success:           #56d672  (green-6)
Warning:           #f79009  (orange-6)
Link:              #5f6ce2  (blue-5)
```

### Component Library
```
Package: @logicbpm/logicbpm-ui-kit
Import:  Button, Input, Badge, Tabs, CardBlock, UserAvatar, Icon, Loader, Typography
CSS:     import '@logicbpm/logicbpm-ui-kit/dist/main.css'
```

### Example Prompts
- *"Build a support ticket card: white bg, `border-radius: 16px`, 1px `#e8eaeb` border, 2px top accent in entity color. Row 1: Badge (type) + ticket ID + priority dot. Row 2: channel pill + status Badge. Body: 3-line clamped description. Footer: client name + date + UserAvatar assignee."*
- *"Create a split-panel messaging UI: 340px sidebar (white, 1px right border `#e8eaeb`) + main chat panel (bg `#f3f4f5`). Outgoing bubbles `#845cdd`/white, incoming `#f3f4f5`/gray-10. Avatars 28px aligned flex-start."*
- *"Design a form modal: 462px wide, 16px border-radius. Input height 40px, 8px radius, gray-2 bg, purple-5 focus border. Submit: Button variant='primary'. Cancel: Button variant='tertiary'."*
- *"Implement an empty state: dog.svg 96px centered, opacity 0.5. Title 'Нет результатов' M/Heading/Secondary. Description S/Text/Inactive. Button variant='secondary' 'Сбросить фильтры' only when filters active."*

### Iteration Guide
1. Start with `#f3f4f5` page, `#ffffff` cards — the purple provides all the color
2. Use `#845cdd` once per view for the primary CTA — don't repeat the accent
3. Borders (`#e8eaeb`) define surfaces — shadows are whispers, not statements
4. Inter 400 for everything, Inter 600 for headings — two weights, full system
5. `16px` radius on cards and buttons — this rounding is the brand's softness
6. All statuses via `Badge` component — semantic color, never raw text styling
