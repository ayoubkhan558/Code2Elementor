# Code2Elementor Project Analysis

## Project Requirements Analysis

### Objective
Convert raw HTML/CSS/JS into Elementor-compatible JSON for rapid template creation, with live preview and configurable output options.

### Inputs
- HTML string
- CSS string (optional)
- JS string (optional)
- Generator options: CSS handling mode (skip/inline/convert-to-classes), include/exclude JS, minify/pretty print JSON, preview toggles.

### Outputs
- Elementor JSON (minified or pretty)
- Optional inclusion of processed JS
- Element structure tree view
- Live rendered HTML preview

### Core Functional Requirements
- Parse HTML DOM reliably and preserve hierarchy.
- Map HTML elements to Elementor components via per-element processors:
  - **Div block** - Container and layout elements
  - **Flexbox** - Flexbox container elements
  - **Heading** - H1-H6 heading elements
  - **Image** - Image elements
  - **Paragraph** - Text and paragraph elements
  - **SVG** - SVG graphics
  - **Button** - Button elements
  - **YouTube** - YouTube video embeds
  - **Divider** - Horizontal dividers/separators
- Convert CSS rules to Elementor style format:
  - Support typography, background, layout (sizing/spacing/positioning), display, grid/flex, borders/shadows, transitions/filters, transforms, scroll, misc layout.
  - Respect pseudo-classes like :hover, :focus.
  - Optional conversion to classes vs inline vs skip.
- Handle advanced cases:
  - Flexbox layouts
  - Data attributes
  - Dynamic classes
  - YouTube video detection
- Include custom JS (optional) in output.
- Provide live preview and structure tree.
- Output options: copy to clipboard, exclude JS, minified/pretty JSON.

### Non-Functional Requirements
- Client-side only; modern browsers (DOMParser).
- Quick, responsive UI (React 19, Vite 6).
- Maintainable modular utilities and processors.
- ESLint configured (flat config), unit tests via Vitest.
- No special env vars; Yarn scripts for dev/build/test.

### Constraints and Assumptions
- No backend / DB / auth.
- Parsing is based on standard DOM; Shadow DOM/external resources may require special handling or are out of scope.
- Elementor JSON must conform to expected schema (enforced via mappers/processors).
- Large CSS files/media queries may need careful performance handling.

### Edge Cases to Consider
- Invalid or malformed HTML.
- Deeply nested elements with conflicting CSS specificity.
- External assets (images/fonts) not available at preview time.
- Complex SVGs and inline styles.
- Unsupported/unknown HTML tags.
- Pseudo-elements (::before/::after) and complex media queries mapping.
- YouTube embed detection from iframes.

### Success Metrics
- Correctness of Elementor JSON output that renders as intended in Elementor.
- Fidelity of styles after conversion.
- Stable performance for typical page-sized inputs.
- Usability: clear structure view, preview parity, straightforward options.

---

## Project Folder Structure Guide

### Root Files
```
/
├── package.json           # Scripts and dependencies (React/Vite/Vitest/ESLint)
├── vite.config.js         # Vite configuration
├── eslint.config.js       # Flat ESLint config
├── yarn.lock              # Yarn dependency lock
├── index.html             # App HTML shell
├── README.md              # Project overview
└── code2Elementor.md      # Additional documentation
```

### Source Directory (`src/`)

#### Entry Points
```
src/
├── App.jsx                # Root app component
├── App.scss               # Global styles
└── main.jsx               # React/Vite entry
```

#### Theme
```
src/theme/
└── codemirror-theme.js    # Code editor theme setup
```

#### Contexts
```
src/contexts/
├── AppContext.jsx         # App-wide settings/state
└── GeneratorContext.jsx   # Generator-specific state and options
```

#### Shared Components
```
src/components/
├── CodeEditor.jsx         # Shared editor wrapper
├── Tooltip.jsx            # UI helper component
└── Tooltip.scss           # Tooltip styles
```

#### Generator Module
```
src/Generator/
├── index.jsx              # Generator page/entry
├── Generator.scss         # Styles for generator screen
└── CssMatcher.jsx         # CSS matching helper UI
```

##### Generator Components
```
src/Generator/components/
├── GeneratorComponent.jsx     # Main generator UI container
├── GeneratorComponent.scss    # Generator container styles
├── CodeEditor.jsx             # Editor for HTML/CSS/JS input
├── Preview.jsx                # Live preview panel
├── Preview.scss               # Preview panel styles
├── StructureView.jsx          # Tree view for element hierarchy
├── StructureView.scss         # Structure view styles
├── AboutModal.jsx             # About/help modal
└── AboutModal.scss            # About modal styles
```

##### Generator Utils
```
src/Generator/utils/
├── elementorGenerator.js  # High-level assembly to produce Elementor JSON
├── domToElementor.js         # Core HTML → Elementor conversion pipeline
├── cssParser.js           # CSS parsing to internal representation
├── jsProcessor.js         # JS inclusion/processing logic
└── utils.js               # Shared utility functions
```

##### Processors
```
src/Generator/utils/processors/
└── attributeProcessor.js  # General attribute handling (data-* etc.)
```

##### Element Processors
```
src/Generator/utils/elementProcessors/
├── buttonProcessor.js             # Button elements
├── dividerProcessor.js            # Divider/separator elements  
├── flexboxProcessor.js            # Flexbox container elements
├── headingProcessor.js            # Heading elements (h1-h6)
├── imageProcessor.js              # Image elements
├── labelUtils.js                  # Label utilities
├── structureLayoutProcessor.js    # Structural/layout elements (div, section, etc.)
├── svgProcessor.js                # SVG elements
├── textElementProcessor.js        # Text/paragraph elements
└── youtubeProcessor.js            # YouTube video elements
```

##### Property Mappers (CSS → Elementor Style)
```
src/Generator/utils/propertyMappers/
├── index.js                   # Main mapper export
├── mapperUtils.js             # Shared mapper utilities
├── background.js              # Background properties
├── boder-box-shadow.js        # Border and box-shadow properties
├── content-flexbox.js         # Flexbox properties
├── content-grid.js            # Grid properties
├── display.js                 # Display properties
├── filters-transitions.js     # Filters and transitions
├── layout-misc.js             # Miscellaneous layout
├── layout-position.js         # Position properties
├── layout-scroll-snap.js      # Scroll snap properties
├── layout-sizing.js           # Sizing properties (width, height)
├── layout-spacing.js          # Spacing properties (margin, padding)
├── scroll.js                  # Scroll properties
├── transforms.js              # Transform properties
└── typography.js              # Typography properties
```

#### Tests
```
src/__tests__/
└── heading.test.js        # Vitest unit tests example
```

---

## Suggested Directory Additions

For future scalability (no files created unless requested):

```
src/hooks/                 # Custom hooks (e.g., useGeneratorOptions, useClipboard)
src/constants/             # Constants/enums (CSS modes, default options)
src/types/                 # JSDoc or TS type definitions/interfaces
src/fixtures/              # Sample HTML/CSS/JS inputs for testing/demo
src/lib/                   # Shared pure functions (parsers/mappers)
tests/                     # Broader unit/integration tests
e2e/                       # End-to-end tests (Playwright/Cypress)
```

---

## Quick Workflow Overview

1. **User inputs HTML/CSS/JS** in `GeneratorComponent`
2. **CSS parsing**: `cssParser.js` parses CSS
3. **Style mapping**: `propertyMappers/*` map styles into Elementor format
4. **DOM traversal**: `domToElementor.js` walks the DOM
5. **Element processing**: `elementProcessors/*` build Elementor JSON nodes
6. **JS handling**: `jsProcessor.js` optionally injects or attaches JS
7. **Assembly**: `elementorGenerator.js` coordinates pipeline and produces final JSON
8. **Display**: `StructureView` shows tree; `Preview` renders HTML; options control output formatting

---

## Supported Elementor Elements

The following Elementor elements are currently supported:

1. **Div Block** (`structureLayoutProcessor.js`) - Container and section elements
2. **Flexbox** (`flexboxProcessor.js`) - Flexbox container elements with display:flex
3. **Heading** (`headingProcessor.js`) - H1-H6 heading elements
4. **Image** (`imageProcessor.js`) - Image elements
5. **Paragraph** (`textElementProcessor.js`) - Text and paragraph elements (p, span, etc.)
6. **SVG** (`svgProcessor.js`) - SVG graphics
7. **Button** (`buttonProcessor.js`) - Button elements
8. **YouTube** (`youtubeProcessor.js`) - YouTube video iframes
9. **Divider** (`dividerProcessor.js`) - Horizontal dividers (hr tags, .divider, .separator)

### Next Steps for Implementation

Each processor file has placeholder settings that need to be replaced with actual Elementor JSON structure. Provide the JSON output from Elementor for each element type to update:

- `youtubeProcessor.js` - Needs Elementor video widget JSON structure
- `dividerProcessor.js` - Needs Elementor divider widget JSON structure  
- `flexboxProcessor.js` - Needs Elementor flexbox container JSON structure
- Other processors may need updates to match Elementor's exact JSON format

---

## Technology Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: Sass, CSS Modules
- **Code Editing**: `@uiw/react-codemirror` with HTML/CSS language support
- **Syntax Highlighting**: PrismJS
- **Linting**: ESLint with React plugins
- **Testing**: Vitest
- **Dependency Management**: Yarn

---

## Development Commands

- **Start dev server**: `yarn dev`
- **Build for production**: `yarn build`
- **Preview production build**: `yarn preview`
- **Run linter**: `yarn lint`
- **Run tests**: `yarn test`
- **Run tests in watch mode**: `yarn test:watch`
