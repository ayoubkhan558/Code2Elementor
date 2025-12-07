/**
 * Shared utility functions for Elementor property mappers
 * Centralized to avoid duplication and ensure consistency
 */

/**
 * Parse size value with unit
 * @param {string} value - CSS value (e.g., "32px", "50%", "auto")
 * @returns {Object} Elementor size object with $$type
 */
export const parseSizeValue = (value) => {
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
 * Create a simple string type value
 * @param {string} value - The string value
 * @returns {Object} Elementor string object
 */
export const createStringValue = (value) => ({
  $$type: 'string',
  value: value
});

/**
 * Create a color type value
 * @param {string} value - The color value
 * @returns {Object} Elementor color object
 */
export const createColorValue = (value) => ({
  $$type: 'color',
  value: value
});

/**
 * Create a number type value
 * @param {number|string} value - The numeric value
 * @returns {Object} Elementor number object
 */
export const createNumberValue = (value) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return {
    $$type: 'number',
    value: isNaN(num) ? 0 : num
  };
};

/**
 * Parse shorthand values (margin, padding, etc.)
 * @param {string} value - CSS shorthand value
 * @returns {Object} Object with top, right, bottom, left values
 */
export const parseShorthandValues = (value) => {
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

  return { top, right, bottom, left };
};

/**
 * Create dimensions value (for margin, padding)
 * @param {string} value - CSS shorthand value
 * @returns {Object} Elementor dimensions object with logical properties
 */
export const createDimensionsValue = (value) => {
  const { top, right, bottom, left } = parseShorthandValues(value);

  return {
    $$type: 'dimensions',
    value: {
      'block-start': parseSizeValue(top),
      'block-end': parseSizeValue(bottom),
      'inline-start': parseSizeValue(left),
      'inline-end': parseSizeValue(right)
    }
  };
};
