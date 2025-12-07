# Code2Elementor - HTML CSS JS to Elementor

This tool is designed to help Elementor users quickly convert their existing HTML/CSS/JS into the proper JSON structure that Elementor can import, saving significant development time when migrating or creating new templates.

## Core Features

### HTML to Elementor Conversion
- Converts raw HTML into Elementor's JSON structure
- Preserves HTML structure and hierarchy
- Handles various HTML elements including section, div, container, forms, buttons, images, and more
- Processes inline styles with flexible handling options

### Supported HTML Elements
| Element | Elementor Widget |
|---------|-----------------|
| `<div>`, `<section>`, `<article>`, `<header>`, `<footer>` | e-div-block |
| `<h1>`-`<h6>` | e-heading |
| `<p>` | e-paragraph |
| `<button>`, `<a>` | e-button |
| `<img>` | e-image |
| `<svg>` | e-image (SVG) |
| `<hr>` | e-divider |
| Flexbox containers | e-flexbox |
| Text-only divs | e-paragraph |

### CSS Processing (Elementor v4 Local Styles)
- **All CSS is applied as local styles** attached to each element
- CSS from class selectors is converted to Elementor's typed format
- Styles populate `styles.variants.props` with proper `$$type` values
- Style ID format: `e-{elementId}-{random}` with `label: "local"`

### Supported CSS Properties
| Category | Properties |
|----------|-----------|
| **Sizing** | width, height, min/max-width/height, overflow, aspect-ratio, object-fit |
| **Layout** | display, flex-direction, justify-content, align-items, gap, flex-wrap, margin, padding |
| **Position** | position, inset-*, z-index, scroll-margin-top |
| **Typography** | font-family, font-weight, font-size, text-align, color, line-height, letter-spacing, text-decoration, text-transform |
| **Border** | border-radius, border-width, border-color, border-style |
| **Background** | background-color, background-image, background-clip |
| **Effects** | opacity, mix-blend-mode, box-shadow, transform, transition, filter |

> See [project-analysis.md](project-analysis.md) for complete documentation.

### JavaScript Integration
- Processes and includes JavaScript functionality
- Supports custom JavaScript code integration
- Maintains global elements and their references

### Preview Functionality
- Live preview of the generated structure
- Toggle between HTML preview and JSON output
- Real-time updates as you type

### Output Options
- Toggle minified/pretty-printed JSON
- Copy to clipboard functionality
- Option to include/exclude JavaScript

---

## Roadmap
- [x] Add support for inline styles to classes
- [x] Elementor v4 local style support
- [x] CSS to Elementor props conversion
- [ ] Add support for more HTML elements (tables, lists, etc.)
- [ ] Add support for CSS Grid properties
- [ ] Add support for CSS Custom Properties (Variables)
- [x] Improve typography property handling
- [ ] Add support for CSS animations and transitions
- [ ] Add support for more complex CSS selectors

## Known Bugs
- [ ] SVG Code is not signed by default



## Technical Implementation

### Modular Architecture
- Separates concerns into different utility files
- Core conversion logic in [domToElementor.js]
- CSS parsing in [cssParser.js]
- JavaScript processing in [jsProcessor.js]

### Browser Compatibility
- Works in modern browsers
- Uses DOMParser for HTML parsing
- Fallback to jsdom in Node.js environments


## Created By

This project was created by [Ayoub Khan](https://mayoub.dev).

[![Portfolio](https://img.shields.io/badge/Portfolio-mayoub.dev-4CAF50?style=flat-square)](https://mayoub.dev) [![LinkedIn](https://img.shields.io/badge/LinkedIn-ayoubkhan558-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/ayoubkhan558)
-------------------------------------------------------------