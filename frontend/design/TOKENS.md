# StudyNotion — Design Tokens (read from Figma screens)

Values below are read off the exported screens. Verify exact hexes in
Figma Dev Mode where precision matters; these are close enough to build with.

## Color

### Backgrounds (richblack scale)
- Page background (darkest)  `#000814`  richblack-900
- Section / body background  `#000C1D` – `#0C1322`
- Header / navbar            `#161D29`  richblack-800
- Card / panel surface       `#161D29`
- Input / field fill         `#2C333F`  richblack-700
- Border / divider           `#2C333F` → `#424854`

### Text
- Primary text (white)       `#F1F2FF`  richblack-5
- Secondary text             `#AFB2BF`  richblack-300
- Muted / placeholder        `#6E727F`  richblack-400
- Disabled / faint           `#585D69`

### Accent — yellow (primary CTA)
- Yellow 50 (main CTA)       `#FFD60A`
- Yellow 100 / hover         `#FFE83D`
- Yellow text on dark        `#FFD60A`
- CTA text color             `#000814` (dark text on yellow)

### Semantic
- Blue (links, "Resend it")  `#47A5C5` / caribbeangreen accents
- Green (completed/progress) `#2ED9A0` – `#06D6A0`
- Pink / danger (Drafted,
  delete, required `*`)      `#EF476F`
- Danger panel background    `#3B0B18` (deep maroon)

### Progress bar
- Track                      `#2C333F`
- Fill (in progress)         `#47A5C5` (cyan/blue)
- Fill (completed)           `#2ED9A0` (green)

## Typography
- Family: **Inter** (all UI). Code blocks use a mono face.
- H1 / page title            ~36–40px, weight 600
- Section heading            ~24–30px, weight 600
- Card title                 ~18–20px, weight 600
- Body                       ~16px, weight 400
- Small / meta               ~13–14px, weight 400
- Label (form)               ~14px, weight 400, text on richblack-5

## Shape & spacing
- Card radius                8px
- Input radius               8px (`rounded-lg`)
- Button radius              8px
- Pill / tab radius          full
- Card padding               24px
- Field height               ~48px
- Page max width             ~1260px content, sidebar 240–310px
- Sidebar active state       yellow left-bar + `#2C333F`-ish tinted bg + yellow text

## Component patterns observed
- **Buttons**: primary = yellow fill, dark text, 8px radius.
  Secondary = `#161D29` fill, light text. Tertiary = transparent + yellow text.
- **Sidebar (dashboard)**: left yellow indicator bar on active item,
  yellow icon+label; section label "Instructor" as muted uppercase-ish divider.
- **Stepper (course creation)**: numbered circles, completed = filled yellow
  with check, active = yellow ring + yellow number, pending = grey fill.
  Dashed connector lines between steps.
- **Status pills**: Published = yellow dot + yellow text; Drafted = pink dot + pink text.
  Pill bg is dark, subtle.
- **Modals**: `#161D29` panel, header row w/ title + ✕, footer right-aligned
  Cancel (dark) + primary (yellow).
- **Upload dropzone**: dashed border, centered cloud-upload icon in a circle,
  "Drag and drop an image, or **Browse**" with Browse in yellow.
- **Course content accordion**: section rows w/ chevron, right-aligned
  "N lectures  51min".
- **Star ratings**: yellow filled stars + grey remainder, numeric value in yellow.

---

## Additions from batch 2/3 screens

### Auth pages
- Layout: two-column on login (form left ~400px, image right); single
  centered column (~370px) for OTP / reset / check-email pages.
- **Top promo bar**: light blue-grey `#DBDDEA`-ish band, dark text,
  full width above the navbar. "PI DAY SALE: … USE STUDYNOTION".
- Logged-out navbar shows a bordered **Sign up** button (transparent
  fill, 1px light border) instead of the avatar.
- Login tagline uses an *italic handwritten-style* accent line in
  blue `#47A5C5` ("Education to future-proof your career").
- **Student / Instructors** toggle: pill group on `#161D29`,
  active segment = darker fill + white text, inactive = muted text.
- Image frame: photo with an offset **crosshatch / diagonal-line**
  decorative square behind-right (not a plain shadow).
- **OTP input**: 6 separate boxes, `#161D29` fill, ~46px square,
  focused box = yellow 1px border + caret; empty boxes show a `-`.
- Password-rule checklist: 2-column, green check icon + small muted
  label per rule (lowercase, uppercase, number, special char, 8-char min).

### Catalog / category page
- Category hero band sits on `#161D29`, with breadcrumb above title,
  description left (max ~60ch) and a **Related resources** bullet list right.
- Section tabs (Most popular / New / Trending): text tabs with a
  yellow underline + yellow text on the active one, muted otherwise.
- Course card: 16:9 thumbnail (no radius on image in catalog grid),
  title (2 lines), instructor name muted, rating row
  (`4.5` yellow + stars + "(Review Count)" muted), price bold white.
- **Bestseller badge**: pink/red `#EF476F`-ish pill, top-left over thumbnail.
- Carousel arrow: circular grey button at the right edge, mid-height.

### Home page
- "Become an Instructor" pill CTA at top of hero — dark pill, border,
  arrow glyph on the right.
- Code-showcase blocks: dark panel, line numbers muted, syntax colors
  in pink/green/yellow, with a soft blue/purple glow behind the panel.
- Stat band inside the skills image: dark green panel with
  large numbers (10 / 250) separated by a vertical rule.
- "Unlock the Power of Code" cards: 3 across; the highlighted card
  is white-on-light with a yellow bottom-left accent, others dark.
