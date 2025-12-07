/**
 * Elementor Effects Property Mappers
 * Converts CSS effects properties to Elementor's JSON format
 */
import { parseSizeValue, createStringValue, createColorValue, createNumberValue } from './mapperUtils';

/**
 * Parse box-shadow value
 * CSS format: [inset] h-offset v-offset [blur] [spread] [color]
 * Reference format from Elementor:
 * - hOffset, vOffset, blur, spread are $$type: 'size'
 * - color is $$type: 'color'  
 * - position is null for outset, { $$type: 'string', value: 'inset' } for inset shadows
 */
const parseBoxShadow = (value) => {
  if (!value || value === 'none') {
    return [];
  }

  const shadows = [];

  // Split multiple shadows (comma-separated, but not inside parentheses)
  const shadowParts = value.split(/,(?![^(]*\))/);

  shadowParts.forEach(shadowValue => {
    const trimmed = shadowValue.trim();
    if (!trimmed) return;

    // Check for inset keyword
    const isInset = /\binset\b/i.test(trimmed);
    let cleanValue = trimmed.replace(/\binset\b/gi, '').trim();

    // Extract color first (it can be anywhere)
    let color = 'rgba(0, 0, 0, 1)';

    // Match rgba/rgb first
    const rgbaMatch = cleanValue.match(/rgba?\([^)]+\)/i);
    if (rgbaMatch) {
      color = rgbaMatch[0];
      cleanValue = cleanValue.replace(rgbaMatch[0], '').trim();
    } else {
      // Match hex color
      const hexMatch = cleanValue.match(/#[0-9a-f]{3,8}/i);
      if (hexMatch) {
        color = hexMatch[0];
        cleanValue = cleanValue.replace(hexMatch[0], '').trim();
      }
    }

    // Now extract all size values with ALL CSS units
    const sizePattern = /[+-]?\d*\.?\d+(?:px|em|rem|vh|vw|vmin|vmax|%|pt|cm|mm|in)?/gi;
    const sizeMatches = cleanValue.match(sizePattern) || [];

    // Check if there's a remaining word that could be a named color
    const remaining = cleanValue.replace(sizePattern, '').trim();
    if (remaining && /^[a-z]+$/i.test(remaining)) {
      color = remaining;
    }

    if (sizeMatches.length >= 2) {
      shadows.push({
        $$type: 'shadow',
        value: {
          hOffset: parseSizeValue(sizeMatches[0] || '0px'),
          vOffset: parseSizeValue(sizeMatches[1] || '0px'),
          blur: parseSizeValue(sizeMatches[2] || '0px'),
          spread: parseSizeValue(sizeMatches[3] || '0px'),
          color: createColorValue(color),
          position: isInset ? createStringValue('inset') : null
        }
      });
    }
  });

  return shadows;
};

/**
 * Parse transform value
 * Supports: rotate, rotateX/Y/Z, scale, scaleX/Y, translate, translateX/Y, skew, skewX/Y
 * Also handles 3D variants: translate3d, rotate3d, scale3d
 */
const parseTransform = (value) => {
  if (!value || value === 'none') {
    return null;
  }

  const functions = [];

  // Extract transform functions
  const transformRegex = /([\w-]+)\(([^)]+)\)/g;
  let match;

  while ((match = transformRegex.exec(value)) !== null) {
    const [_, func, args] = match;
    const argsList = args.split(/,\s*/);

    switch (func) {
      case 'rotate':
        // rotate(angle) - applies to Z axis
        functions.push({
          $$type: 'transform-rotate',
          value: {
            x: parseSizeValue('0deg'),
            y: parseSizeValue('0deg'),
            z: parseSizeValue(args.trim())
          }
        });
        break;

      case 'rotateX':
        functions.push({
          $$type: 'transform-rotate',
          value: {
            x: parseSizeValue(args.trim()),
            y: parseSizeValue('0deg'),
            z: parseSizeValue('0deg')
          }
        });
        break;

      case 'rotateY':
        functions.push({
          $$type: 'transform-rotate',
          value: {
            x: parseSizeValue('0deg'),
            y: parseSizeValue(args.trim()),
            z: parseSizeValue('0deg')
          }
        });
        break;

      case 'rotateZ':
        functions.push({
          $$type: 'transform-rotate',
          value: {
            x: parseSizeValue('0deg'),
            y: parseSizeValue('0deg'),
            z: parseSizeValue(args.trim())
          }
        });
        break;

      case 'scale':
        // scale(x) or scale(x, y)
        functions.push({
          $$type: 'transform-scale',
          value: {
            x: createNumberValue(argsList[0]),
            y: createNumberValue(argsList[1] || argsList[0])
          }
        });
        break;

      case 'scaleX':
        functions.push({
          $$type: 'transform-scale',
          value: {
            x: createNumberValue(args.trim()),
            y: createNumberValue(1)
          }
        });
        break;

      case 'scaleY':
        functions.push({
          $$type: 'transform-scale',
          value: {
            x: createNumberValue(1),
            y: createNumberValue(args.trim())
          }
        });
        break;

      case 'translate':
        // translate(x) or translate(x, y)
        functions.push({
          $$type: 'transform-translate',
          value: {
            x: parseSizeValue(argsList[0]),
            y: parseSizeValue(argsList[1] || '0px')
          }
        });
        break;

      case 'translateX':
        functions.push({
          $$type: 'transform-translate',
          value: {
            x: parseSizeValue(args.trim()),
            y: parseSizeValue('0px')
          }
        });
        break;

      case 'translateY':
        functions.push({
          $$type: 'transform-translate',
          value: {
            x: parseSizeValue('0px'),
            y: parseSizeValue(args.trim())
          }
        });
        break;

      case 'translate3d':
        // translate3d(x, y, z) - Elementor only uses x, y
        functions.push({
          $$type: 'transform-translate',
          value: {
            x: parseSizeValue(argsList[0]),
            y: parseSizeValue(argsList[1] || '0px')
          }
        });
        break;

      case 'skew':
        // skew(x) or skew(x, y)
        functions.push({
          $$type: 'transform-skew',
          value: {
            x: parseSizeValue(argsList[0]),
            y: parseSizeValue(argsList[1] || '0deg')
          }
        });
        break;

      case 'skewX':
        functions.push({
          $$type: 'transform-skew',
          value: {
            x: parseSizeValue(args.trim()),
            y: parseSizeValue('0deg')
          }
        });
        break;

      case 'skewY':
        functions.push({
          $$type: 'transform-skew',
          value: {
            x: parseSizeValue('0deg'),
            y: parseSizeValue(args.trim())
          }
        });
        break;

      // Ignore unsupported transforms like matrix, perspective, etc.
    }
  }

  // Return null if no valid transforms were parsed
  if (functions.length === 0) {
    return null;
  }

  return {
    $$type: 'transform',
    value: {
      'transform-functions': {
        $$type: 'transform-functions',
        value: functions
      }
    }
  };
};

/**
 * Parse transition value
 */
const parseTransition = (value) => {
  const transitions = [];

  // Split multiple transitions
  const parts = value.split(/,\s*(?![^(]*\))/);

  parts.forEach(part => {
    const [property, duration, timing, delay] = part.trim().split(/\s+/);

    transitions.push({
      $$type: 'selection-size',
      value: {
        selection: {
          $$type: 'key-value',
          value: {
            key: createStringValue(property === 'all' ? 'All properties' : property),
            value: createStringValue(property || 'all')
          }
        },
        size: parseSizeValue(duration || '200ms')
      }
    });
  });

  return transitions;
};

/**
 * Parse filter value
 */
const parseFilter = (value) => {
  const filters = [];

  const filterRegex = /(\w+(?:-\w+)?)\(([^)]+)\)/g;
  let match;

  while ((match = filterRegex.exec(value)) !== null) {
    const [_, func, arg] = match;

    let filterObj = {
      $$type: 'css-filter-func',
      value: {
        func: createStringValue(func),
        args: null
      }
    };

    switch (func) {
      case 'blur':
        filterObj.value.args = {
          $$type: 'blur',
          value: {
            size: parseSizeValue(arg)
          }
        };
        break;

      case 'brightness':
      case 'contrast':
      case 'saturate':
        filterObj.value.args = {
          $$type: 'intensity',
          value: {
            size: parseSizeValue(arg)
          }
        };
        break;

      case 'hue-rotate':
        filterObj.value.args = {
          $$type: 'hue-rotate',
          value: {
            size: parseSizeValue(arg)
          }
        };
        break;

      case 'grayscale':
      case 'invert':
      case 'sepia':
        filterObj.value.args = {
          $$type: 'color-tone',
          value: {
            size: parseSizeValue(arg)
          }
        };
        break;

      case 'drop-shadow':
        const shadowParts = arg.match(/([+-]?\d+(?:\.\d+)?[a-z]*)\s+([+-]?\d+(?:\.\d+)?[a-z]*)\s+([+-]?\d+(?:\.\d+)?[a-z]*)?\s*(rgba?\([^)]+\)|#[0-9a-f]{3,8})?/i);
        if (shadowParts) {
          filterObj.value.args = {
            $$type: 'drop-shadow',
            value: {
              xAxis: parseSizeValue(shadowParts[1] || '0px'),
              yAxis: parseSizeValue(shadowParts[2] || '0px'),
              blur: parseSizeValue(shadowParts[3] || '0px'),
              color: createColorValue(shadowParts[4] || 'rgba(0, 0, 0, 1)')
            }
          };
        }
        break;
    }

    filters.push(filterObj);
  }

  return filters;
};

/**
 * Elementor Effects Mappers
 */
export const elementorEffectsMappers = {
  // Mix Blend Mode
  'mix-blend-mode': (value) => ({
    'mix-blend-mode': createStringValue(value)
  }),

  // Opacity
  'opacity': (value) => {
    const numValue = parseFloat(value);
    let size = numValue;

    // If value is between 0-1, convert to percentage
    if (numValue >= 0 && numValue <= 1) {
      size = numValue * 100;
    }

    return {
      opacity: {
        $$type: 'size',
        value: {
          size: size,
          unit: '%'
        }
      }
    };
  },

  // Box Shadow - returns empty if no valid shadows
  'box-shadow': (value) => {
    if (!value || value === 'none') {
      return {};
    }
    const shadows = parseBoxShadow(value);
    if (shadows.length === 0) {
      return {};
    }
    return {
      'box-shadow': {
        $$type: 'box-shadow',
        value: shadows
      }
    };
  },

  // Transform
  'transform': (value) => {
    if (!value || value === 'none') {
      return {};
    }
    const transformResult = parseTransform(value);
    if (!transformResult) {
      return {};
    }
    return {
      transform: transformResult
    };
  },

  // Transition
  'transition': (value) => {
    if (!value || value === 'none') {
      return {};
    }
    const transitions = parseTransition(value);
    if (transitions.length === 0) {
      return {};
    }
    return {
      transition: {
        $$type: 'transition',
        value: transitions
      }
    };
  },

  // Filter - returns empty if no valid filters
  'filter': (value) => {
    if (!value || value === 'none') {
      return {};
    }
    const filters = parseFilter(value);
    if (filters.length === 0) {
      return {};
    }
    return {
      filter: {
        $$type: 'filter',
        value: filters
      }
    };
  },

  // Backdrop Filter - not fully supported, skip for now to avoid validation errors
  'backdrop-filter': (value) => {
    // Skip backdrop-filter as it may not be fully supported in Elementor v4
    return {};
  },

  // Cursor
  'cursor': (value) => ({
    cursor: createStringValue(value)
  }),

  // Pointer Events
  'pointer-events': (value) => ({
    'pointer-events': createStringValue(value)
  }),

  // User Select
  'user-select': (value) => ({
    'user-select': createStringValue(value)
  }),

  // Visibility
  'visibility': (value) => ({
    visibility: createStringValue(value)
  }),

  // Clip Path
  'clip-path': (value) => ({
    'clip-path': createStringValue(value)
  }),

  // Transform Origin
  'transform-origin': (value) => ({
    'transform-origin': createStringValue(value)
  }),

  // Perspective
  'perspective': (value) => ({
    perspective: parseSizeValue(value)
  }),

  // Animation
  'animation': (value) => ({
    animation: createStringValue(value)
  }),
  'animation-name': (value) => ({
    'animation-name': createStringValue(value)
  }),
  'animation-duration': (value) => ({
    'animation-duration': parseSizeValue(value)
  }),
  'animation-delay': (value) => ({
    'animation-delay': parseSizeValue(value)
  }),
  'animation-iteration-count': (value) => ({
    'animation-iteration-count': createStringValue(value)
  }),
  'animation-timing-function': (value) => ({
    'animation-timing-function': createStringValue(value)
  }),
  'animation-fill-mode': (value) => ({
    'animation-fill-mode': createStringValue(value)
  }),

  // Will Change
  'will-change': (value) => ({
    'will-change': createStringValue(value)
  })
};
