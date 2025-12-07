/**
 * Elementor Layout Property Mappers
 * Converts CSS layout properties to Elementor's JSON format
 */
import { parseSizeValue, createStringValue, createDimensionsValue } from './mapperUtils';

/**
 * Elementor Layout Mappers
 */
export const elementorLayoutMappers = {
  // Display
  'display': (value) => ({
    display: createStringValue(value)
  }),

  // Flex Direction
  'flex-direction': (value) => ({
    'flex-direction': createStringValue(value)
  }),

  // Justify Content
  'justify-content': (value) => ({
    'justify-content': createStringValue(value)
  }),

  // Align Items
  'align-items': (value) => ({
    'align-items': createStringValue(value)
  }),

  // Gap (flexbox/grid) - uses layout-direction with row and column
  'gap': (value) => {
    // Handle two-value gap (row column)
    const values = value.trim().split(/\s+/);
    const rowGap = parseSizeValue(values[0]);
    const columnGap = parseSizeValue(values[1] || values[0]);

    return {
      gap: {
        $$type: 'layout-direction',
        value: {
          row: rowGap,
          column: columnGap
        }
      }
    };
  },

  // Row Gap
  'row-gap': (value) => ({
    'row-gap': parseSizeValue(value)
  }),

  // Column Gap (layout)
  'column-gap': (value) => ({
    'column-gap': parseSizeValue(value)
  }),

  // Flex Wrap
  'flex-wrap': (value) => ({
    'flex-wrap': createStringValue(value)
  }),

  // Align Content
  'align-content': (value) => ({
    'align-content': createStringValue(value)
  }),

  // Margin (uses dimensions with logical properties)
  'margin': (value) => ({
    margin: createDimensionsValue(value)
  }),

  // Margin individual sides
  'margin-top': (value) => ({
    'margin-top': parseSizeValue(value)
  }),
  'margin-right': (value) => ({
    'margin-right': parseSizeValue(value)
  }),
  'margin-bottom': (value) => ({
    'margin-bottom': parseSizeValue(value)
  }),
  'margin-left': (value) => ({
    'margin-left': parseSizeValue(value)
  }),

  // Padding (uses dimensions with logical properties)
  'padding': (value) => ({
    padding: createDimensionsValue(value)
  }),

  // Padding individual sides
  'padding-top': (value) => ({
    'padding-top': parseSizeValue(value)
  }),
  'padding-right': (value) => ({
    'padding-right': parseSizeValue(value)
  }),
  'padding-bottom': (value) => ({
    'padding-bottom': parseSizeValue(value)
  }),
  'padding-left': (value) => ({
    'padding-left': parseSizeValue(value)
  }),

  // Flex properties for children
  'flex': (value) => ({
    flex: createStringValue(value)
  }),
  'flex-grow': (value) => ({
    'flex-grow': {
      $$type: 'number',
      value: parseFloat(value) || 0
    }
  }),
  'flex-shrink': (value) => ({
    'flex-shrink': {
      $$type: 'number',
      value: parseFloat(value) || 1
    }
  }),
  'flex-basis': (value) => ({
    'flex-basis': parseSizeValue(value)
  }),
  'order': (value) => ({
    'order': {
      $$type: 'number',
      value: parseInt(value, 10) || 0
    }
  }),
  'align-self': (value) => ({
    'align-self': createStringValue(value)
  }),
  'justify-self': (value) => ({
    'justify-self': createStringValue(value)
  })
};
