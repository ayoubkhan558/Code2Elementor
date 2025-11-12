/**
 * Elementor Typography Property Mappers
 * Converts CSS typography properties to Elementor's JSON format
 */

/**
 * Parse size value with unit
 * @param {string} value - CSS value (e.g., "16px", "115%")
 * @returns {Object} Elementor size object
 */
const parseSizeValue = (value) => {
  if (!value || value === 'auto' || value === 'none') {
    return {
      $$type: 'size',
      value: {
        size: '',
        unit: 'auto'
      }
    };
  }

  // Handle calc() and other custom values
  if (value.includes('calc(') || value.includes('var(')) {
    return {
      $$type: 'size',
      value: {
        size: value,
        unit: 'custom'
      }
    };
  }

  // Extract number and unit
  const match = value.match(/^([+-]?[\d.]+)([a-z%]+)$/i);
  if (match) {
    const size = parseFloat(match[1]);
    const unit = match[2];
    return {
      $$type: 'size',
      value: {
        size: size,
        unit: unit
      }
    };
  }

  // Fallback for unitless values
  const numValue = parseFloat(value);
  if (!isNaN(numValue)) {
    return {
      $$type: 'size',
      value: {
        size: numValue,
        unit: 'px'
      }
    };
  }

  return {
    $$type: 'size',
    value: {
      size: '',
      unit: 'auto'
    }
  };
};

/**
 * Elementor Typography Mappers
 */
export const elementorTypographyMappers = {
  // Font Family
  'font-family': (value) => {
    return {
      'font-family': {
        $$type: 'string',
        value: value
      }
    };
  },

  // Font Weight
  'font-weight': (value) => {
    return {
      'font-weight': {
        $$type: 'string',
        value: value
      }
    };
  },

  // Font Size
  'font-size': (value) => {
    return {
      'font-size': parseSizeValue(value)
    };
  },

  // Text Align
  'text-align': (value) => {
    return {
      'text-align': {
        $$type: 'string',
        value: value
      }
    };
  },

  // Color
  'color': (value) => {
    return {
      color: {
        $$type: 'color',
        value: value
      }
    };
  },

  // Line Height
  'line-height': (value) => {
    return {
      'line-height': parseSizeValue(value)
    };
  },

  // Letter Spacing
  'letter-spacing': (value) => {
    return {
      'letter-spacing': parseSizeValue(value)
    };
  },

  // Word Spacing
  'word-spacing': (value) => {
    return {
      'word-spacing': parseSizeValue(value)
    };
  },

  // Column Count
  'column-count': (value) => {
    const numValue = parseInt(value, 10);
    return {
      'column-count': {
        $$type: 'number',
        value: isNaN(numValue) ? 1 : numValue
      }
    };
  },

  // Column Gap
  'column-gap': (value) => {
    return {
      'column-gap': parseSizeValue(value)
    };
  },

  // Text Decoration
  'text-decoration': (value) => {
    return {
      'text-decoration': {
        $$type: 'string',
        value: value
      }
    };
  },

  // Text Transform
  'text-transform': (value) => {
    return {
      'text-transform': {
        $$type: 'string',
        value: value
      }
    };
  },

  // Direction
  'direction': (value) => {
    return {
      direction: {
        $$type: 'string',
        value: value
      }
    };
  },

  // Font Style
  'font-style': (value) => {
    return {
      'font-style': {
        $$type: 'string',
        value: value
      }
    };
  },

  // Stroke (text stroke)
  'stroke': (value) => {
    // Parse stroke value (e.g., "1px #ddb0b0")
    const match = value.match(/^([^\s]+)\s+(.+)$/);
    if (match) {
      const width = match[1];
      const color = match[2];
      return {
        stroke: {
          $$type: 'stroke',
          value: {
            color: {
              $$type: 'color',
              value: color
            },
            width: parseSizeValue(width)
          }
        }
      };
    }
    
    // Fallback
    return {
      stroke: {
        $$type: 'stroke',
        value: {
          color: {
            $$type: 'color',
            value: '#000000'
          },
          width: {
            $$type: 'size',
            value: {
              size: 1,
              unit: 'px'
            }
          }
        }
      }
    };
  },

  // -webkit-text-stroke-width (alternative stroke property)
  '-webkit-text-stroke-width': (value) => {
    return {
      stroke: {
        $$type: 'stroke',
        value: {
          width: parseSizeValue(value)
        }
      }
    };
  },

  // -webkit-text-stroke-color (alternative stroke property)
  '-webkit-text-stroke-color': (value) => {
    return {
      stroke: {
        $$type: 'stroke',
        value: {
          color: {
            $$type: 'color',
            value: value
          }
        }
      }
    };
  }
};
