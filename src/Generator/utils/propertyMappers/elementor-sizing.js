/**
 * Elementor Sizing Property Mappers
 * Converts CSS sizing properties to Elementor's JSON format
 */
import { parseSizeValue, createStringValue } from './mapperUtils';

/**
 * Elementor Sizing Mappers
 */
export const elementorSizingMappers = {
  // Width
  'width': (value) => ({
    width: parseSizeValue(value)
  }),

  // Height
  'height': (value) => ({
    height: parseSizeValue(value)
  }),

  // Min Width
  'min-width': (value) => ({
    'min-width': parseSizeValue(value)
  }),

  // Max Width
  'max-width': (value) => ({
    'max-width': parseSizeValue(value)
  }),

  // Min Height
  'min-height': (value) => ({
    'min-height': parseSizeValue(value)
  }),

  // Max Height
  'max-height': (value) => ({
    'max-height': parseSizeValue(value)
  }),

  // Overflow
  'overflow': (value) => ({
    overflow: createStringValue(value)
  }),

  'overflow-x': (value) => ({
    'overflow-x': createStringValue(value)
  }),

  'overflow-y': (value) => ({
    'overflow-y': createStringValue(value)
  }),

  // Aspect Ratio
  'aspect-ratio': (value) => ({
    'aspect-ratio': createStringValue(value)
  }),

  // Object Fit
  'object-fit': (value) => ({
    'object-fit': createStringValue(value)
  }),

  // Object Position
  'object-position': (value) => ({
    'object-position': createStringValue(value)
  }),

  // Box Sizing
  'box-sizing': (value) => ({
    'box-sizing': createStringValue(value)
  })
};
