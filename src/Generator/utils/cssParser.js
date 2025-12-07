// cssParser.js
// CSS parsing utilities
import { CSS_PROP_MAPPERS, isPropertySupported, getMapper } from './propertyMappers';

// Convert basic color names to hex; pass through hex values
export function toHex(val) {
  if (!val) return null;

  // Preserve rgb/rgba colors as-is
  if (val.startsWith('rgb')) {
    return val;
  }

  // Handle hex colors
  if (val.startsWith('#')) {
    return val.length === 4 || val.length === 7 ? val : null;
  }

  // Handle named colors
  const namedColors = {
    'black': '#000000',
    'white': '#ffffff',
    'gray': '#808080',
    'lightgray': '#d3d3d3',
    'darkgray': '#a9a9a9',
    'red': '#ff0000',
    'darkred': '#8b0000',
    'blue': '#0000ff',
    'navy': '#000080',
    'skyblue': '#87ceeb',
    'dodgerblue': '#1e90ff',
    'royalblue': '#4169e1',
    'green': '#008000',
    'lime': '#00ff00',
    'limegreen': '#32cd32',
    'seagreen': '#2e8b57',
    'teal': '#008080',
    'aqua': '#00ffff',
    'cyan': '#00ffff',
    'yellow': '#ffff00',
    'orange': '#ffa500',
    'orangered': '#ff4500',
    'gold': '#ffd700',
    'pink': '#ffc0cb',
    'hotpink': '#ff69b4',
    'purple': '#800080',
    'violet': '#ee82ee',
    'magenta': '#ff00ff',
    'silver': '#c0c0c0',
    'whitesmoke': '#f5f5f5',
    'lightblue': '#add8e6',
    'lightgreen': '#90ee90',
    'lightpink': '#ffb6c1'
  };


  return namedColors[val.toLowerCase()] || null;
}

// Parse numeric values, removing 'px' unit but keeping other units
export const parseValue = (value) => {
  if (typeof value !== 'string') return value;

  // Handle CSS variables
  if (value.startsWith('var(')) return value;

  // Handle calc() and other CSS functions
  if (value.includes('(')) return value;

  // Handle numbers with units
  const numMatch = value.match(/^(-?\d*\.?\d+)([a-z%]*)$/);
  if (numMatch) {
    const num = numMatch[1];
    const unit = numMatch[2];

    // For px values, we just want the number
    if (unit === 'px') return num;

    // For other units (%, em, rem, deg, etc.), keep the unit
    return value;
  }

  return value;
};

// CSS properties Elementor has native controls for and how to map them
// Now uses unified CSS_PROP_MAPPERS from propertyMappers
export const getCssPropMappers = (settings) => {
  // Return all property mappers plus special handlers
  return {
    ...CSS_PROP_MAPPERS,

    // CSS Classes & ID (legacy handler)
    'css-classes': (val) => {
      if (settings) settings._cssClasses = val;
      return {};
    },

    // Special mapper for pseudo-classes (legacy handler)
    '_pseudo': (value, pseudoClass) => {
      if (!settings) return {};
      if (!settings._pseudo) settings._pseudo = {};
      if (!settings._pseudo[pseudoClass]) settings._pseudo[pseudoClass] = {};

      // Handle nested properties for pseudo-classes
      if (value.startsWith('_')) {
        const [prop, val] = value.split(':').map(s => s.trim());
        settings._pseudo[pseudoClass][prop] = JSON.parse(val);
      } else {
        const [prop, val] = value.split(':').map(s => s.trim());
        const mapper = getMapper(prop);
        if (mapper) {
          const result = mapper(val);
          Object.assign(settings._pseudo[pseudoClass], result);
        }
      }
      return {};
    },
  };
};

// Parse CSS declarations into Elementor settings
export function parseCssDeclarations(combinedProperties, className = '', variables = {}) {
  const settings = {};
  const customRules = {};

  const resolveCssVariables = (value) => {
    if (typeof value !== 'string' || !value.includes('var(')) {
      return value;
    }
    return value.replace(/var\((--[\w-]+)\)/g, (match, varName) => {
      return variables[varName] || match;
    });
  };

  // Handle combined properties object
  if (typeof combinedProperties === 'object') {
    Object.entries(combinedProperties).forEach(([prop, value]) => {
      const resolvedValue = resolveCssVariables(value);
      const normalizedProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      const CSS_PROP_MAPPERS = getCssPropMappers(settings);
      const mapper = CSS_PROP_MAPPERS[prop] || CSS_PROP_MAPPERS[normalizedProp];

      if (mapper) {
        try {
          mapper(resolvedValue, settings);
        } catch (e) {
          console.error(`Error processing ${prop}: ${resolvedValue}`, e);
          if (!customRules[prop]) customRules[prop] = {};
          customRules[prop][resolvedValue] = true;
        }
      } else {
        if (!customRules[prop]) customRules[prop] = {};
        customRules[prop][resolvedValue] = true;
      }
    });
  } else {
    // Handle CSS string
    const commentlessCss = combinedProperties.replace(/\/\*[\s\S]*?\*\//g, '');
    const cleanCss = commentlessCss.replace(/\s+/g, ' ').replace(/\s*([:;{}])\s*/g, '$1').trim();
    const declarations = cleanCss.split(';').filter(Boolean);

    declarations.forEach(decl => {
      if (!decl.trim()) return;

      const colonIndex = decl.indexOf(':');
      if (colonIndex === -1) return;

      const prop = decl.slice(0, colonIndex).trim();
      const value = decl.slice(colonIndex + 1).trim();

      if (!prop || !value) return;

      const resolvedValue = resolveCssVariables(value);
      const normalizedProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      const CSS_PROP_MAPPERS = getCssPropMappers(settings);
      const mapper = CSS_PROP_MAPPERS[prop] || CSS_PROP_MAPPERS[normalizedProp];

      if (mapper) {
        try {
          mapper(resolvedValue, settings);
        } catch (e) {
          console.error(`Error processing ${prop}: ${resolvedValue}`, e);
          if (!customRules[prop]) customRules[prop] = {};
          customRules[prop][resolvedValue] = true;
        }
      } else {
        if (!customRules[prop]) customRules[prop] = {};
        customRules[prop][resolvedValue] = true;
      }
    });
  }

  // Handle custom rules
  const nativeProperties = [
    'padding', 'margin', 'background', 'color', 'font-size', 'border',
    'width', 'height', 'display', 'position', 'top', 'right', 'bottom', 'left', 'box-shadow'
  ];

  Object.keys(customRules).forEach(property => {
    if (nativeProperties.includes(property)) {
      delete customRules[property];
    }
  });

  if (Object.keys(customRules).length > 0) {
    const fallbackClassName = className || '%root%';
    const cssRules = Object.keys(customRules).map(prop => {
      const values = Object.keys(customRules[prop]).join(', ');
      return `${prop}: ${values}`;
    }).join('; ');
    if (!settings._skipTransitionCustom) {
      const selector = fallbackClassName === ':root' ? ':root' : `.${fallbackClassName}`;
      settings._cssCustom = `${selector} {\n  ${cssRules};\n}`;
    }
    settings._skipTransitionCustom = false;
  }

  return settings;
}

/**
 * Convert CSS properties to Elementor's props format for styles.variants.props
 * Also collects unsupported properties for custom_css.raw
 * @param {Object} cssProperties - Object of CSS property:value pairs
 * @param {Object} variables - CSS variables for resolution
 * @returns {Object} { props: Elementor-formatted props, customCss: raw CSS string for unsupported properties }
 */
export function cssToElementorProps(cssProperties, variables = {}) {
  const props = {};
  const unsupportedCss = [];

  const resolveCssVariables = (value) => {
    if (typeof value !== 'string' || !value.includes('var(')) {
      return value;
    }
    return value.replace(/var\((--[\w-]+)\)/g, (match, varName) => {
      return variables[varName] || match;
    });
  };

  Object.entries(cssProperties).forEach(([prop, value]) => {
    const resolvedValue = resolveCssVariables(value);
    const normalizedProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    const CSS_PROP_MAPPERS = getCssPropMappers({});
    const mapper = CSS_PROP_MAPPERS[prop] || CSS_PROP_MAPPERS[normalizedProp];

    if (mapper && typeof mapper === 'function') {
      try {
        const result = mapper(resolvedValue);
        if (result && typeof result === 'object' && Object.keys(result).length > 0) {
          // Mapper returned valid props
          Object.assign(props, result);
        } else {
          // Mapper returned empty object (unsupported or invalid value)
          unsupportedCss.push(`${prop}: ${resolvedValue};`);
        }
      } catch (e) {
        console.error(`Error processing ${prop}: ${resolvedValue}`, e);
        unsupportedCss.push(`${prop}: ${resolvedValue};`);
      }
    } else {
      // No mapper for this property - add to unsupported
      unsupportedCss.push(`${prop}: ${resolvedValue};`);
    }
  });

  return {
    props,
    customCss: unsupportedCss.length > 0 ? unsupportedCss.join('\n') : null
  };
}

// Enhanced CSS matching function
export function matchCSSSelectors(element, cssMap) {
  const combinedProperties = {};
  const doc = element.ownerDocument;

  // Helper to parse CSS properties string into object
  const parseProperties = (propertiesString) => {
    const properties = {};
    const declarations = propertiesString.split(';').filter(decl => decl.trim());

    declarations.forEach(decl => {
      const [property, value] = decl.split(':').map(part => part.trim());
      if (property && value) {
        properties[property] = value;
      }
    });

    return properties;
  };

  // Check each CSS selector against the element
  Object.entries(cssMap).forEach(([selector, properties]) => {
    try {
      let matches = false;

      // Try to match the selector
      try {
        matches = element.matches(selector);
      } catch (e) {
        // If selector is invalid for matches(), try alternative methods
        const selectorType = getSelectorType(selector);

        if (selectorType === 'tag' && element.tagName.toLowerCase() === selector.toLowerCase()) {
          matches = true;
        } else if (selectorType === 'class' && element.classList.contains(selector.substring(1))) {
          matches = true;
        } else if (selectorType === 'id' && element.id === selector.substring(1)) {
          matches = true;
        } else if (selectorType === 'complex') {
          // For complex selectors, try querySelectorAll on document
          try {
            const matchingElements = doc.querySelectorAll(selector);
            matches = Array.from(matchingElements).includes(element);
          } catch (err) {
            // If still fails, skip this selector
            matches = false;
          }
        }
      }

      if (matches) {
        const parsedProperties = parseProperties(properties);
        Object.assign(combinedProperties, parsedProperties);

        // console.log(`Element matched by: ${selector}`);
        // console.log('Properties:', parsedProperties);
      }
    } catch (error) {
      console.warn(`Error processing selector: ${selector}`, error);
    }
  });

  return combinedProperties;
}

// Helper to determine selector type
const getSelectorType = (selector) => {
  if (selector.startsWith('#')) return 'id';
  if (selector.startsWith('.')) return 'class';
  if (selector.includes('>') || selector.includes('+') || selector.includes('~') ||
    selector.includes(' ') || selector.includes('[')) return 'complex';
  return 'tag';
};


/**
 * Enhanced buildCssMap function to handle complex selectors
 * @param {string} cssText - The CSS content
 * @returns {Object} Map of selectors to their CSS declarations
 */
export function buildCssMap(cssText) {
  const map = {};
  const variables = {};
  let rootStyles = [];

  // Remove comments and normalize whitespace
  const cleanCSS = cssText
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Split into rules
  const rules = [];
  let current = '';
  let inBrackets = 0;

  for (let i = 0; i < cleanCSS.length; i++) {
    const char = cleanCSS[i];
    if (char === '{') {
      inBrackets++;
    } else if (char === '}') {
      inBrackets--;
      if (inBrackets === 0) {
        rules.push(current.trim() + '}');
        current = '';
        continue;
      }
    }
    current += char;
  }

  // Process each rule
  rules.forEach(rule => {
    const [selectorPart, ...rest] = rule.split('{');
    if (!selectorPart || !rest.length) return;

    const properties = rest.join('{').replace(/}$/, '').trim();
    if (!properties) return;

    // Split multiple selectors and process each one
    selectorPart.split(',').forEach(selector => {
      const trimmed = selector.trim();
      if (trimmed) {
        map[trimmed] = properties;

        if (trimmed === ':root') {
          // Add to root styles array
          rootStyles.push(properties);

          // Process variables from all root blocks
          properties.split(';').forEach(prop => {
            const [key, value] = prop.split(':').map(s => s.trim());
            if (key && key.startsWith('--')) {
              variables[key] = value;
            }
          });
        }
      }
    });
  });

  // Join all root styles with semicolons to maintain valid CSS
  const combinedRootStyles = rootStyles.join(';');
  return { cssMap: map, variables, rootStyles: combinedRootStyles };
}