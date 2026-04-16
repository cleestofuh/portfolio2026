# design-freg

A portable design system reference for Chris Lo's portfolio. This file captures the design tokens, typography, components, usage patterns, and principles so that this theming can be applied across projects.

---

## Design Tokens

### Color

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#1a1a1a` | Primary text, borders, headings, buttons |
| `--color-body` | `#444` | Body text in case study sections |
| `--color-body-alt` | `#333` | Body text on about page, bio sections |
| `--color-muted` | `#555` | Secondary body text, taglines, blurb sans text |
| `--color-subtle` | `#666` | Tertiary text like role descriptions |
| `--color-light` | `#777` | Work card descriptions |
| `--color-disabled` | `#888` | Article card descriptions |
| `--color-placeholder` | `#999` | Back links, labels, captions, footer text |
| `--color-border-soft` | `#bbb` | Insight dashes, dropdown company labels |
| `--color-caption` | `#aaa` | Image captions, figcaptions |
| `--color-border` | `#e8e8e8` | Section dividers, metric borders, card borders |
| `--color-surface` | `#ffffff` | Card backgrounds, blobs, navbar, form fields |
| `--color-surface-subtle` | `#f7f7f5` | Code blocks, agent tree background |
| `--color-surface-muted` | `#f7f7f7` | Impact bar background |
| `--color-surface-preview` | `#f0f0f0` | Card preview placeholder |
| `--color-surface-hover` | `#f2f2f2` | Image placeholder background |
| `--color-bg` | `#CFDBE5` | Page background (pond blue) |
| `--color-contact-bg` | `#8aab87` | Contact section background (moss green) |
| `--color-button-bg` | `rgb(168, 162, 154)` | Button default background (stone) |
| `--color-highlight` | `rgba(233, 227, 139, 0.45)` | Delight highlight on hover |
| `--color-success` | `#1a3a1a` | Success feedback text |
| `--color-error` | `#5a1a1a` | Error feedback text |
| `--color-ripple` | `rgba(255, 255, 255, 1)` | Ripple ring border |

### Typography

#### Font Families

| Name | Stack | Usage |
|------|-------|-------|
| Display | `'Just Me Again Down Here', cursive` | Hero title, navbar logo name |
| Sans | `'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif` | Everything else: body, headings, labels, buttons, links, nav |
| Mono | `'DM Mono', 'Courier New', monospace` | Agent tree / code blocks |

#### Type Scale

| Name | Size | Weight | Properties | Usage |
|------|------|--------|------------|-------|
| Hero title | `clamp(7.5rem, 20vw, 12.5rem)` | 400 | line-height: 0.75, display font | Main landing name |
| Page heading | `clamp(2.25rem, 5vw, 3.5rem)` | 600 | line-height: 1.1 | About page name |
| CS title | `clamp(2rem, 5vw, 3.5rem)` | 600 | line-height: 1.1, lowercase | Case study titles |
| Blurb heading | `clamp(1.5rem, 3.5vw, 3rem)` | 600 | line-height: 1.4, lowercase | About blurb serif text |
| Section heading | `1.5rem` | 600 | lowercase | Case study section headings |
| Work heading | `2rem` | 600 | lowercase, centered | Work section heading |
| Contact heading | `2rem` | 600 | lowercase | Contact section heading |
| Tagline | `1.125rem` | 400 | line-height: 1.7 | Case study taglines |
| Callout | `1.125rem` | 600 | line-height: 1.6 | Blockquote callouts |
| Body | `1rem` | 400 | line-height: 1.75 | Case study body, bio, skills |
| Body subtitle | `clamp(1rem, 2vw, 1.625rem)` | 400 | line-height: 1.6, lowercase | Blurb subtitle text |
| Subtitle | `clamp(1rem, 2vw, 1.125rem)` | 400 | Hero subtitle |
| Card title | `1.125rem` | 500 | Work card title |
| Card desc | `0.875rem` | 400 | line-height: 1.6 | Work card description |
| Button | `1rem` | 600 | letter-spacing: 0.05em | Hero nav, contact button |
| Nav link | `1rem` | 400 | lowercase | Navbar links |
| Input | `0.9375rem` | 400 | Form inputs |
| Link text | `0.9375rem` | 600 | border-bottom: 2px solid | PDF/CTA links |
| Back link | `0.9375rem` | 400 | lowercase | Case study back links |
| Quick btn | `0.8125rem` | 600 | lowercase, centered | Quick links buttons |
| Label | `0.75rem` | 600 | letter-spacing: 0.08em, lowercase | Meta labels, section labels, impact label, skills heading |
| Company tag | `0.8125rem` | 600 | letter-spacing: 0.08em, lowercase | Case study company |
| Card company | `0.6875rem` | 600 | letter-spacing: 0.02em | Work card company |
| Caption | `0.75rem` | 400 | lowercase | Image captions, figcaptions |
| Footer | `0.75rem` | 400 | lowercase | Site footer |
| Mono body | `0.875rem` | 400 | line-height: 1.8 | Agent tree text |

#### Text Transform

Almost everything uses `text-transform: lowercase`. This is a defining trait of the design language. Exceptions are rare and intentional (e.g. proper nouns with `.about-link--preserve-case`).

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| Page max-width | `960px` | About blob, work section, contact inner, about page inner |
| CS max-width | `800px` | Case study hero, sections, footer nav |
| Section gap | `96px` (desktop), `64px` (mobile) | Between case study sections |
| Component padding | `56px 64px` (desktop), `40px 36px` (tablet), `0` (mobile) | Blob containers |
| Page padding | `0 48px` (desktop), `0 24px` (mobile) | Horizontal page margins |
| Card body padding | `24px 32px 32px` | Inside work cards |
| Form field padding | `14px 18px` | Input/textarea |
| Button padding | `10px 28px` / `10px 32px` | Nav buttons, contact button |
| Grid gap | `32px` | Work card grid |
| Card width | `360px` | Work cards |
| Card preview height | `220px` | Work card image area |

### Border Radius

The design system uses organic, asymmetric border-radius values to create a natural, blob-like aesthetic. There are no standard rounded corners.

#### Blob Shapes (animated)

The primary blobs cycle through these shapes over 10s:

```
62% 38% 54% 46% / 44% 56% 44% 56%
42% 58% 38% 62% / 58% 44% 56% 42%
54% 46% 62% 38% / 56% 44% 46% 54%
38% 62% 46% 54% / 42% 58% 42% 58%
56% 44% 40% 60% / 52% 48% 56% 44%
48% 52% 58% 42% / 46% 54% 38% 62%
```

#### Static Organic Shapes

Buttons, photos, and other elements use fixed organic border-radius with a different shape on hover:

```css
/* Pattern: each element gets a unique resting shape and hover shape */
resting: 62% 38% 52% 48% / 44% 58% 42% 56%
hover:   44% 56% 38% 62% / 58% 42% 60% 40%
```

The 8-value `border-radius` format (`TL TR BR BL / TL TR BR BL`) is used everywhere. Never use uniform or 4-value border-radius unless it's an internal element (image inside a modal, dropdown, etc.).

### Motion

| Pattern | Duration | Easing | Usage |
|---------|----------|--------|-------|
| Blob morph | `10s` | `ease-in-out`, infinite | Background blobs continuously morphing |
| Blob morph hover | `3x` playback rate for `800ms` | via JS `updatePlaybackRate` | Blob speeds up on hover, returns to 1x |
| Hover shape shift | `0.6s` | `ease` | Static border-radius transitions on hover |
| Hover background | `0.35s` | `ease` | Button color changes |
| Hover translate | `0.3s` | `ease-out` | Elements shift away from cursor on hover |
| Reveal (scroll) | `0.8s` / `0.6s` | `ease` | Fade up on scroll intersection |
| Page enter | `0.7s` | `ease-out` | About page staggered entry |
| Gentle reveal | `1s` | `ease-out` | Hero subtitle, nav, quick links entry |
| Ripple expand | `2s` | `ease-out` | Concentric ripple rings |
| Float | `12-16s` | `ease-in-out`, infinite | Subtle drift on hero elements |
| Lily emerge | `1.5s` | `ease-out` | Lily pad entrance |
| Frog wiggle | `0.5s` | `ease-in-out` | Periodic frog attention wiggle |
| Frog jump | `0.55s` | `ease-in-out` | Frog click animation with arc |
| Modal fade | `0.2s` | `ease` | Image/video modal appearance |

#### Stagger Pattern

Reveal animations use incremental `--reveal-delay` values (typically `80ms` apart) to create a cascading entrance. Work cards use `i * 100ms` based on index.

#### Reduced Motion

All animations respect `prefers-reduced-motion: reduce`. Blobs fall back to a static organic shape.

---

## Components

### Blob

The foundational container. White background with continuously morphing organic border-radius. Used as a background container for content sections.

- Class: `.blob` + variant (`.about-blob`, `.work-blob`, `.cs-quick-links-blob`)
- Background: `#ffffff`
- Animation: `blobMorph 10s ease-in-out infinite`
- Hover: playback rate accelerates to 3x for 800ms via JS, then returns to 1x
- Content is placed inside the blob with padding

### Work Card

A clickable card linking to a case study with an organic clipped shape.

- Organic SVG clip-path (no standard rectangle)
- SVG border stroke drawn inside the clip
- Image preview (220px height, `object-fit: cover`)
- Image scales to 1.04 on hover
- Card lifts with `translateY(-3px)` and shadow on hover
- Card shifts away from cursor via `setupHoverShift`
- Layout: 2-column grid at 360px card width

### Hero Navigation Buttons

Pill-shaped links with organic border-radius and dark borders.

- Background: `rgb(168, 162, 154)` (stone)
- Border: `3px solid #1a1a1a`
- Hover: background flips to `#1a1a1a`, text to white, shape shifts
- Each button has a unique resting and hover shape
- Includes hidden SVG whirl that rotates on hover

### Navbar

Fixed top navigation that fades in on scroll.

- Hidden by default (`opacity: 0, pointer-events: none`)
- `.navbar--visible`: fades in with white semi-transparent background
- Logo uses display font + frog SVG (frog bounces on click)
- Links: lowercase, 1rem, fade on hover
- Mobile: hamburger menu with fullscreen drawer

### Contact Form

Form with organic SVG-clipped input fields.

- Each field wrapped in SVG clip-path for organic shape
- SVG stroke border drawn as overlay
- Submit button matches hero nav button style
- Background: `#8aab87` (moss green) section

### Image/Video Modal

Lightbox overlay for case study images and videos.

- Background: `rgba(0, 0, 0, 0.85)` / `rgba(0, 0, 0, 0.9)`
- Cursor: `zoom-out` on overlay, default on content
- Fade-in animation
- Max-height: `90vh`

### Callout

Blockquote-style emphasis for key questions or statements.

- Left border: `3px solid #1a1a1a`
- Bold text, 1.125rem
- Used for HMW (How Might We) questions

### Impact Bar

Highlighted outcomes section on case study pages.

- Background: `#f7f7f7`
- Rounded: `8px`
- Contains label, blurb, and skip link

### Agent Tree

Monospace file tree visualization.

- Background: `#f7f7f5`
- Border-radius: `12px`
- Font: DM Mono, 0.875rem
- Folder/file icons with indentation levels (20px increments)

### Ripple Rings

Concentric expanding ring animations triggered by interaction or page load.

- White border rings that scale from 0 and fade out over 2s
- Border thins from 4px to 1px as it expands
- Spawned imperatively via DOM (not React state)

### Scroll Reveal

Intersection observer-based fade-up entrance for elements.

- Start: `opacity: 0, translateY(20px)`
- Visible: `opacity: 1, translateY(0)`
- Duration: `0.8s` (homepage) / `0.6s` (case study)
- Staggered via `data-reveal-delay` or `--reveal-delay`

---

## Patterns and Principles

### Organic over geometric

Nothing is a perfect rectangle or circle. Every container, button, card, image mask, and interactive element uses asymmetric, organic border-radius values. This creates a natural, handcrafted feel that runs through the entire experience.

### Lowercase everywhere

All UI text is lowercased via `text-transform: lowercase`. This is not optional. It creates a casual, approachable, and distinctive tone. The only exception is preserving proper nouns when explicitly marked (`.about-link--preserve-case`).

### Hover shifts away

Interactive elements physically shift away from the cursor on hover via `setupHoverShift`. This creates a subtle feeling of interaction without aggressive animation, as if elements are gently displaced by the cursor's presence.

### Continuous ambient motion

Blobs morph continuously. Hero elements float on subtle offset cycles at different speeds (12s, 14s, 16s). The page feels alive without demanding attention. Hover accelerates the morph momentarily, then settles back.

### Staggered reveals

Content never appears all at once. Scroll-triggered reveals cascade with incremental delays. Page entries (about page) stagger by ~80-100ms per element. This creates a natural reading rhythm.

### Interaction spawns ripples

Click and hover events on the hero spawn concentric white ripple rings. This extends the pond/water metaphor of the design and gives tactile feedback to exploration.

### SVG borders over CSS borders

Cards and form fields use hand-drawn SVG paths for their borders and clip-paths rather than CSS `border` or `border-radius`. This keeps the organic aesthetic even on rectangular content, with slight wobble in the stroke paths.

### Dark-on-light with warm neutrals

The palette stays in the neutral range: dark text on light surfaces. Color is used sparingly and environmentally (pond blue background, moss green contact section) rather than on UI elements. Buttons use a warm stone tone, not a saturated brand color.

### Content max-widths

Content is constrained to either `960px` (homepage sections) or `800px` (case study pages). This keeps line lengths comfortable and centers the reading experience.

### Imagery treated organically

Photos and preview images are masked with organic clip-paths or border-radius. Images are never displayed in raw rectangular frames. Hover transitions shift the organic shape to reinforce the living aesthetic.

### Accessible by default

- `prefers-reduced-motion` disables all animations
- Semantic HTML structure
- Form fields have proper labeling patterns
- Sufficient contrast ratios with the dark-on-light palette
- Focus and keyboard interaction preserved under organic styling
