# Code2Elementor Project Analysis

## Supported Features

### HTML Elements
| Element | Status | Elementor Widget |
|---------|--------|-----------------|
| `<div>` | ✅ | e-div-block |
| `<section>` | ✅ | e-div-block |
| `<article>` | ✅ | e-div-block |
| `<aside>` | ✅ | e-div-block |
| `<header>` | ✅ | e-div-block |
| `<footer>` | ✅ | e-div-block |
| `<h1>-<h6>` | ✅ | e-heading |
| `<p>` | ✅ | e-paragraph |
| `<button>` | ✅ | e-button |
| `<a>` | ✅ | e-button |
| `<img>` | ✅ | e-image |
| `<svg>` | ✅ | e-image (SVG) |
| `<hr>` | ✅ | e-divider |
| `<iframe>` (YouTube) | ✅ | video |
| Flexbox containers | ✅ | e-flexbox |
| Text-only divs | ✅ | e-paragraph |

### Not Yet Supported
| Element | Status |
|---------|--------|
| `<table>` | ❌ |
| `<ul>/<ol>/<li>` | ❌ |
| `<form>` elements | ❌ |
| Grid layout | ❌ |
| `<video>` | ❌ |
| `<audio>` | ❌ |

---

## Supported CSS Properties

### Sizing (✅ Fully Supported)
- `width`, `height`
- `min-width`, `max-width`, `min-height`, `max-height`
- `overflow`, `overflow-x`, `overflow-y`
- `aspect-ratio`
- `object-fit`, `object-position`
- `box-sizing`

### Layout (✅ Fully Supported)
- `display`
- `flex-direction`, `flex-wrap`, `flex`, `flex-grow`, `flex-shrink`, `flex-basis`
- `justify-content`, `align-items`, `align-content`, `align-self`, `justify-self`
- `gap`, `row-gap`, `column-gap`
- `order`
- `margin` (all sides + shorthand)
- `padding` (all sides + shorthand)

### Position (✅ Fully Supported)
- `position`
- `top`, `right`, `bottom`, `left` (converted to logical properties)
- `inset`, `inset-block-start`, `inset-block-end`, `inset-inline-start`, `inset-inline-end`
- `z-index`
- `float`, `clear`
- `vertical-align`
- `scroll-margin-top`

### Typography (✅ Fully Supported)
- `font-family`, `font-size`, `font-weight`, `font-style`
- `color`
- `text-align`, `text-decoration`, `text-transform`, `text-indent`
- `line-height`, `letter-spacing`, `word-spacing`
- `white-space`, `word-break`, `text-overflow`
- `direction`
- `column-count`, `column-gap`
- `-webkit-text-stroke`, stroke width/color

### Border (✅ Fully Supported)
- `border` (shorthand + individual sides)
- `border-width` (all sides)
- `border-color` (all sides)
- `border-style` (all sides)
- `border-radius` (all corners)
- `outline`, `outline-width`, `outline-style`, `outline-color`, `outline-offset`

### Background (✅ Partially Supported)
- `background`, `background-color`
- `background-image` (gradients + URLs)
- `background-size`, `background-position`, `background-repeat`
- `background-attachment`, `background-origin`
- `background-clip`, `-webkit-background-clip`
- `background-blend-mode`

### Effects (✅ Fully Supported)
- `opacity`, `mix-blend-mode`
- `box-shadow`
- `filter` (blur, brightness, contrast, saturate, hue-rotate, grayscale, invert, sepia, drop-shadow)
- `backdrop-filter`
- `transform` (rotate, scale, translate, skew)
- `transform-origin`, `perspective`
- `transition`
- `animation` (all properties)
- `cursor`, `pointer-events`, `user-select`, `visibility`
- `clip-path`, `will-change`

---

## Architecture

### Property Mappers (`src/Generator/utils/propertyMappers/`)

The code is modular and easily extensible:

```
propertyMappers/
├── index.js           # Main export, combines all mappers
├── mapperUtils.js     # Shared utilities (parseSizeValue, createStringValue, etc.)
├── elementor-sizing.js
├── elementor-layout.js
├── elementor-position.js
├── elementor-border.js
├── elementor-typography.js
├── elementor-background.js
└── elementor-effects.js
```

### Adding New Properties

1. Open the relevant mapper file (or create a new one)
2. Import utilities from `mapperUtils.js`
3. Add property mapper function:

```javascript
'new-property': (value) => ({
  'new-property': createStringValue(value)
})
```

4. If creating a new category, add to `index.js` imports

---

## Style Application

### Local Styles Only
- All CSS is converted to **local styles** attached to each element
- Style ID format: `e-{elementId}-{random}`
- Style label: `"local"`
- CSS properties populate `styles.variants.props`

---

## Elementor v4 Compatibility
- ✅ Uses v4 element types (`e-div-block`, `e-paragraph`, etc.)
- ✅ Uses `$$type` for typed values
- ✅ Nested element structure (full objects, not IDs)
- ✅ Local class styling with `styles` object
- ✅ `editor_settings.title` for element labels

---

## Known Limitations
1. Global classes not exported (all styles are local)
2. Pseudo-class styles (`:hover`) require manual implementation
3. Media queries not fully supported
4. CSS Grid not implemented
