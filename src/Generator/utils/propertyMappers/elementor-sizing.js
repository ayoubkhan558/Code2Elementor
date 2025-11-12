/**
 * Elementor Sizing Property Mappers
 * Converts CSS sizing properties to Elementor's JSON format
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
 * Elementor Sizing Mappers
 */
export const elementorSizingMappers = {
  // Width
  'width': (value) => {
    return {
      width: parseSizeValue(value)
    };
  },

  // Height
  'height': (value) => {
    return {
      height: parseSizeValue(value)
    };
  },

  // Min Width
  'min-width': (value) => {
    return {
      'min-width': parseSizeValue(value)
    };
  },

  // Max Width
  'max-width': (value) => {
    return {
      'max-width': parseSizeValue(value)
    };
  },

  // Min Height
  'min-height': (value) => {
    return {
      'min-height': parseSizeValue(value)
    };
  },

  // Max Height
  'max-height': (value) => {
    return {
      'max-height': parseSizeValue(value)
    };
  },

  // Overflow
  'overflow': (value) => {
    return {
      overflow: {
        $$type: 'string',
        value: value
      }
    };
  },

  'overflow-x': (value) => {
    return {
      'overflow-x': {
        $$type: 'string',
        value: value
      }
    };
  },

  'overflow-y': (value) => {
    return {
      'overflow-y': {
        $$type: 'string',
        value: value
      }
    };
  },

  // Aspect Ratio
  'aspect-ratio': (value) => {
    return {
      'aspect-ratio': {
        $$type: 'string',
        value: value
      }
    };
  },

  // Object Fit
  'object-fit': (value) => {
    return {
      'object-fit': {
        $$type: 'string',
        value: value
      }
    };
  },

  // Object Position
  'object-position': (value) => {
    return {
      'object-position': {
        $$type: 'string',
        value: value
      }
    };
  }
};
