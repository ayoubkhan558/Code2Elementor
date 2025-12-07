/**
 * Elementor Border Property Mappers
 * Converts CSS border properties to Elementor's JSON format
 */
import { parseSizeValue, createStringValue, createColorValue } from './mapperUtils';

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

  // Individual border-radius corners
  'border-top-left-radius': (value) => ({
    'border-radius': {
      $$type: 'border-radius',
      value: { 'start-start': parseSizeValue(value) }
    }
  }),
  'border-top-right-radius': (value) => ({
    'border-radius': {
      $$type: 'border-radius',
      value: { 'start-end': parseSizeValue(value) }
    }
  }),
  'border-bottom-right-radius': (value) => ({
    'border-radius': {
      $$type: 'border-radius',
      value: { 'end-end': parseSizeValue(value) }
    }
  }),
  'border-bottom-left-radius': (value) => ({
    'border-radius': {
      $$type: 'border-radius',
      value: { 'end-start': parseSizeValue(value) }
    }
  }),

  // Border Width
  'border-width': (value) => ({
    'border-width': parseSizeValue(value)
  }),

  // Individual border widths
  'border-top-width': (value) => ({
    'border-top-width': parseSizeValue(value)
  }),
  'border-right-width': (value) => ({
    'border-right-width': parseSizeValue(value)
  }),
  'border-bottom-width': (value) => ({
    'border-bottom-width': parseSizeValue(value)
  }),
  'border-left-width': (value) => ({
    'border-left-width': parseSizeValue(value)
  }),

  // Border Color
  'border-color': (value) => ({
    'border-color': createColorValue(value)
  }),

  // Individual border colors
  'border-top-color': (value) => ({
    'border-top-color': createColorValue(value)
  }),
  'border-right-color': (value) => ({
    'border-right-color': createColorValue(value)
  }),
  'border-bottom-color': (value) => ({
    'border-bottom-color': createColorValue(value)
  }),
  'border-left-color': (value) => ({
    'border-left-color': createColorValue(value)
  }),

  // Border Style
  'border-style': (value) => ({
    'border-style': createStringValue(value)
  }),

  // Individual border styles
  'border-top-style': (value) => ({
    'border-top-style': createStringValue(value)
  }),
  'border-right-style': (value) => ({
    'border-right-style': createStringValue(value)
  }),
  'border-bottom-style': (value) => ({
    'border-bottom-style': createStringValue(value)
  }),
  'border-left-style': (value) => ({
    'border-left-style': createStringValue(value)
  }),

  // Border shorthand
  'border': (value) => {
    // Parse: width style color
    const match = value.match(/^(\d+\w*)\s+(\w+)\s+(.+)$/);
    if (match) {
      return {
        'border-width': parseSizeValue(match[1]),
        'border-style': createStringValue(match[2]),
        'border-color': createColorValue(match[3])
      };
    }
    return {};
  },

  // Individual border shorthands
  'border-top': (value) => {
    const match = value.match(/^(\d+\w*)\s+(\w+)\s+(.+)$/);
    if (match) {
      return {
        'border-top-width': parseSizeValue(match[1]),
        'border-top-style': createStringValue(match[2]),
        'border-top-color': createColorValue(match[3])
      };
    }
    return {};
  },
  'border-right': (value) => {
    const match = value.match(/^(\d+\w*)\s+(\w+)\s+(.+)$/);
    if (match) {
      return {
        'border-right-width': parseSizeValue(match[1]),
        'border-right-style': createStringValue(match[2]),
        'border-right-color': createColorValue(match[3])
      };
    }
    return {};
  },
  'border-bottom': (value) => {
    const match = value.match(/^(\d+\w*)\s+(\w+)\s+(.+)$/);
    if (match) {
      return {
        'border-bottom-width': parseSizeValue(match[1]),
        'border-bottom-style': createStringValue(match[2]),
        'border-bottom-color': createColorValue(match[3])
      };
    }
    return {};
  },
  'border-left': (value) => {
    const match = value.match(/^(\d+\w*)\s+(\w+)\s+(.+)$/);
    if (match) {
      return {
        'border-left-width': parseSizeValue(match[1]),
        'border-left-style': createStringValue(match[2]),
        'border-left-color': createColorValue(match[3])
      };
    }
    return {};
  },

  // Outline
  'outline': (value) => ({
    outline: createStringValue(value)
  }),
  'outline-width': (value) => ({
    'outline-width': parseSizeValue(value)
  }),
  'outline-style': (value) => ({
    'outline-style': createStringValue(value)
  }),
  'outline-color': (value) => ({
    'outline-color': createColorValue(value)
  }),
  'outline-offset': (value) => ({
    'outline-offset': parseSizeValue(value)
  })
};
