/**
 * Elementor Position Property Mappers
 * Converts CSS position properties to Elementor's JSON format
 */
import { parseSizeValue, createStringValue, createNumberValue } from './mapperUtils';

/**
 * Elementor Position Mappers
 */
export const elementorPositionMappers = {
  // Position
  'position': (value) => ({
    position: createStringValue(value)
  }),

  // Traditional position properties (converted to logical properties)
  'top': (value) => ({
    'inset-block-start': parseSizeValue(value)
  }),
  'right': (value) => ({
    'inset-inline-end': parseSizeValue(value)
  }),
  'bottom': (value) => ({
    'inset-block-end': parseSizeValue(value)
  }),
  'left': (value) => ({
    'inset-inline-start': parseSizeValue(value)
  }),

  // Logical position properties
  'inset-inline-end': (value) => ({
    'inset-inline-end': parseSizeValue(value)
  }),
  'inset-block-start': (value) => ({
    'inset-block-start': parseSizeValue(value)
  }),
  'inset-block-end': (value) => ({
    'inset-block-end': parseSizeValue(value)
  }),
  'inset-inline-start': (value) => ({
    'inset-inline-start': parseSizeValue(value)
  }),

  // Inset shorthand
  'inset': (value) => {
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
      'inset-block-start': parseSizeValue(top),
      'inset-inline-end': parseSizeValue(right),
      'inset-block-end': parseSizeValue(bottom),
      'inset-inline-start': parseSizeValue(left)
    };
  },

  // Z-Index
  'z-index': (value) => ({
    'z-index': createNumberValue(value)
  }),

  // Scroll Margin Top
  'scroll-margin-top': (value) => ({
    'scroll-margin-top': parseSizeValue(value)
  }),

  // Float
  'float': (value) => ({
    'float': createStringValue(value)
  }),

  // Clear
  'clear': (value) => ({
    'clear': createStringValue(value)
  }),

  // Vertical Align
  'vertical-align': (value) => ({
    'vertical-align': createStringValue(value)
  })
};
