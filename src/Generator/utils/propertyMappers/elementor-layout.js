/**
 * Elementor Layout Property Mappers
 * Converts CSS layout properties to Elementor's JSON format
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
 * Elementor Layout Mappers
 */
export const elementorLayoutMappers = {
  // Display
  'display': (value) => {
    return {
      display: {
        $$type: 'string',
        value: value
      }
    };
  },

  // Flex Direction
  'flex-direction': (value) => {
    return {
      'flex-direction': {
        $$type: 'string',
        value: value
      }
    };
  },

  // Justify Content
  'justify-content': (value) => {
    return {
      'justify-content': {
        $$type: 'string',
        value: value
      }
    };
  },

  // Align Items
  'align-items': (value) => {
    return {
      'align-items': {
        $$type: 'string',
        value: value
      }
    };
  },

  // Gap (flexbox/grid) - uses layout-direction with row and column
  'gap': (value) => {
    const parsedSize = parseSizeValue(value);
    
    return {
      gap: {
        $$type: 'layout-direction',
        value: {
          row: parsedSize,
          column: parsedSize
        }
      }
    };
  },

  // Flex Wrap
  'flex-wrap': (value) => {
    return {
      'flex-wrap': {
        $$type: 'string',
        value: value
      }
    };
  },

  // Align Content
  'align-content': (value) => {
    return {
      'align-content': {
        $$type: 'string',
        value: value
      }
    };
  },

  // Margin (uses dimensions with logical properties)
  'margin': (value) => {
    // Parse margin value (can be 1-4 values)
    const values = value.trim().split(/\s+/);
    
    let top, right, bottom, left;
    
    if (values.length === 1) {
      top = right = bottom = left = values[0];
    } else if (values.length === 2) {
      top = bottom = values[0];
      right = left = values[1];
    } else if (values.length === 3) {
      top = values[0];
      right = left = values[1];
      bottom = values[2];
    } else {
      top = values[0];
      right = values[1];
      bottom = values[2];
      left = values[3];
    }

    return {
      margin: {
        $$type: 'dimensions',
        value: {
          'block-start': parseSizeValue(top),
          'block-end': parseSizeValue(bottom),
          'inline-start': parseSizeValue(left),
          'inline-end': parseSizeValue(right)
        }
      }
    };
  }
};
