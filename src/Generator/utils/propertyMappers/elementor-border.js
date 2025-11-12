/**
 * Elementor Border Property Mappers
 * Converts CSS border properties to Elementor's JSON format
 */

/**
 * Parse size value with unit
 * @param {string} value - CSS value (e.g., "2px", "1em")
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
 * Elementor Border Mappers
 */
export const elementorBorderMappers = {
  // Border Radius (uses logical properties: start-start, start-end, end-start, end-end)
  'border-radius': (value) => {
    // Parse border-radius value (can be 1-4 values)
    const values = value.trim().split(/\s+/);
    
    // Map values to logical properties
    let topLeft, topRight, bottomRight, bottomLeft;
    
    if (values.length === 1) {
      topLeft = topRight = bottomRight = bottomLeft = values[0];
    } else if (values.length === 2) {
      topLeft = bottomRight = values[0];
      topRight = bottomLeft = values[1];
    } else if (values.length === 3) {
      topLeft = values[0];
      topRight = bottomLeft = values[1];
      bottomRight = values[2];
    } else {
      topLeft = values[0];
      topRight = values[1];
      bottomRight = values[2];
      bottomLeft = values[3];
    }

    return {
      'border-radius': {
        $$type: 'border-radius',
        value: {
          'start-start': parseSizeValue(topLeft),
          'start-end': parseSizeValue(topRight),
          'end-start': parseSizeValue(bottomLeft),
          'end-end': parseSizeValue(bottomRight)
        }
      }
    };
  },

  // Border Width
  'border-width': (value) => {
    return {
      'border-width': parseSizeValue(value)
    };
  },

  // Border Color
  'border-color': (value) => {
    return {
      'border-color': {
        $$type: 'color',
        value: value
      }
    };
  },

  // Border Style
  'border-style': (value) => {
    return {
      'border-style': {
        $$type: 'string',
        value: value
      }
    };
  }
};
