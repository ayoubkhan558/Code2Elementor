/**
 * Elementor Typography Property Mappers
 * Converts CSS typography properties to Elementor's JSON format
 */
import { parseSizeValue, createStringValue, createColorValue, createNumberValue } from './mapperUtils';

/**
 * Elementor Typography Mappers
 */
export const elementorTypographyMappers = {
  // Font Family
  'font-family': (value) => ({
    'font-family': createStringValue(value)
  }),

  // Font Weight
  'font-weight': (value) => ({
    'font-weight': createStringValue(String(value))
  }),

  // Font Size
  'font-size': (value) => ({
    'font-size': parseSizeValue(value)
  }),

  // Text Align
  'text-align': (value) => ({
    'text-align': createStringValue(value)
  }),

  // Color
  'color': (value) => ({
    color: createColorValue(value)
  }),

  // Line Height
  'line-height': (value) => ({
    'line-height': parseSizeValue(value)
  }),

  // Letter Spacing
  'letter-spacing': (value) => ({
    'letter-spacing': parseSizeValue(value)
  }),

  // Word Spacing
  'word-spacing': (value) => ({
    'word-spacing': parseSizeValue(value)
  }),

  // Column Count
  'column-count': (value) => ({
    'column-count': createNumberValue(value)
  }),

  // Typography Column Gap
  'column-gap': (value) => ({
    'column-gap': parseSizeValue(value)
  }),

  // Text Decoration
  'text-decoration': (value) => ({
    'text-decoration': createStringValue(value)
  }),

  // Text Decoration Line
  'text-decoration-line': (value) => ({
    'text-decoration-line': createStringValue(value)
  }),

  // Text Decoration Style
  'text-decoration-style': (value) => ({
    'text-decoration-style': createStringValue(value)
  }),

  // Text Decoration Color
  'text-decoration-color': (value) => ({
    'text-decoration-color': createColorValue(value)
  }),

  // Text Transform
  'text-transform': (value) => ({
    'text-transform': createStringValue(value)
  }),

  // Direction
  'direction': (value) => ({
    direction: createStringValue(value)
  }),

  // Font Style
  'font-style': (value) => ({
    'font-style': createStringValue(value)
  }),

  // Text Shadow
  'text-shadow': (value) => ({
    'text-shadow': createStringValue(value)
  }),

  // White Space
  'white-space': (value) => ({
    'white-space': createStringValue(value)
  }),

  // Word Break
  'word-break': (value) => ({
    'word-break': createStringValue(value)
  }),

  // Text Overflow
  'text-overflow': (value) => ({
    'text-overflow': createStringValue(value)
  }),

  // Text Indent
  'text-indent': (value) => ({
    'text-indent': parseSizeValue(value)
  }),

  // Stroke (text stroke) - complex type
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
            color: createColorValue(color),
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
          color: createColorValue('#000000'),
          width: {
            $$type: 'size',
            value: { size: 1, unit: 'px' }
          }
        }
      }
    };
  },

  // -webkit-text-stroke-width
  '-webkit-text-stroke-width': (value) => ({
    stroke: {
      $$type: 'stroke',
      value: {
        width: parseSizeValue(value)
      }
    }
  }),

  // -webkit-text-stroke-color
  '-webkit-text-stroke-color': (value) => ({
    stroke: {
      $$type: 'stroke',
      value: {
        color: createColorValue(value)
      }
    }
  }),

  // -webkit-text-stroke (shorthand)
  '-webkit-text-stroke': (value) => {
    const match = value.match(/^([^\s]+)\s+(.+)$/);
    if (match) {
      return {
        stroke: {
          $$type: 'stroke',
          value: {
            width: parseSizeValue(match[1]),
            color: createColorValue(match[2])
          }
        }
      };
    }
    return {};
  }
};
