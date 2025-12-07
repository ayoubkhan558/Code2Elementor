/**
 * Property Mappers Index
 * Exports all CSS to Elementor property mappers
 * 
 * To add new property mappers:
 * 1. Create a new file: elementor-{category}.js
 * 2. Import utility functions from mapperUtils.js
 * 3. Export an object with CSS property names as keys and mapper functions as values
 * 4. Import and spread into CSS_PROP_MAPPERS below
 */
import { elementorSizingMappers } from './elementor-sizing';
import { elementorLayoutMappers } from './elementor-layout';
import { elementorPositionMappers } from './elementor-position';
import { elementorBorderMappers } from './elementor-border';
import { elementorTypographyMappers } from './elementor-typography';
import { elementorBackgroundMappers } from './elementor-background';
import { elementorEffectsMappers } from './elementor-effects';

// Re-export utilities for external use
export * from './mapperUtils';

/**
 * Combined CSS Property Mappers
 * Each mapper takes a CSS value and returns an Elementor props object
 * 
 * Example:
 * 'padding': (value) => ({
 *   padding: {
 *     $$type: 'dimensions',
 *     value: {...}
 *   }
 * })
 */
export const CSS_PROP_MAPPERS = {
  ...elementorSizingMappers,
  ...elementorLayoutMappers,
  ...elementorPositionMappers,
  ...elementorBorderMappers,
  ...elementorTypographyMappers,
  ...elementorBackgroundMappers,
  ...elementorEffectsMappers
};

/**
 * Get list of all supported CSS properties
 * @returns {string[]} Array of supported CSS property names
 */
export const getSupportedProperties = () => Object.keys(CSS_PROP_MAPPERS);

/**
 * Check if a CSS property is supported
 * @param {string} property - CSS property name
 * @returns {boolean} Whether the property is supported
 */
export const isPropertySupported = (property) => property in CSS_PROP_MAPPERS;

/**
 * Get mapper for a specific CSS property
 * @param {string} property - CSS property name
 * @returns {Function|null} Mapper function or null if not supported
 */
export const getMapper = (property) => CSS_PROP_MAPPERS[property] || null;
