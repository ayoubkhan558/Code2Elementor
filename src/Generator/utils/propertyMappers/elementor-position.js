/**
 * Elementor Position Property Mappers
 * Converts CSS position properties to Elementor's JSON format
 */

/**
 * Parse size value with unit
 * @param {string} value - CSS value (e.g., "32px", "50%", "auto")
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
 * Elementor Position Mappers
 */
export const elementorPositionMappers = {
  // Position
  'position': (value) => {
    return {
      position: {
        $$type: 'string',
        value: value
      }
    };
  },

  // Inset Inline End (right in LTR)
  'inset-inline-end': (value) => {
    return {
      'inset-inline-end': parseSizeValue(value)
    };
  },

  // Inset Block Start (top)
  'inset-block-start': (value) => {
    return {
      'inset-block-start': parseSizeValue(value)
    };
  },

  // Inset Block End (bottom)
  'inset-block-end': (value) => {
    return {
      'inset-block-end': parseSizeValue(value)
    };
  },

  // Inset Inline Start (left in LTR)
  'inset-inline-start': (value) => {
    return {
      'inset-inline-start': parseSizeValue(value)
    };
  },

  // Z-Index
  'z-index': (value) => {
    const numValue = parseInt(value, 10);
    return {
      'z-index': {
        $$type: 'number',
        value: isNaN(numValue) ? 0 : numValue
      }
    };
  },

  // Scroll Margin Top
  'scroll-margin-top': (value) => {
    return {
      'scroll-margin-top': parseSizeValue(value)
    };
  }
};
