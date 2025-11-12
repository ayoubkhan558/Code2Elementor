import { getUniqueId } from '../utils';
import { getElementLabel } from './labelUtils';

/**
 * Processes SVG elements for Elementor conversion
 * @param {Node} node - The DOM node to process
 * @param {Object} element - The element object to populate
 * @param {string} tag - The HTML tag name
 * @param {Object} context - Optional context values (showNodeClass, etc.)
 * @returns {Object} The processed element
 */
export const processSvgElement = (node, element, tag = 'svg', context = {}) => {
  // Generate unique ID for the SVG element
  const elementId = getUniqueId();
  
  // Extract SVG code - get the outer HTML of the SVG element
  const svgCode = node.outerHTML || '';
  
  // Create wrapper div with SVG inside for Elementor format
  const svgHtmlCache = `\t\t\t<div class="e-svg-base" >${svgCode}</div>\t\t`;
  
  // Create Elementor SVG structure
  const svgElement = {
    id: elementId,
    elType: 'widget',
    isInner: false,
    isLocked: false,
    settings: {
      _element_id: node.id || ''
    },
    defaultEditSettings: {
      defaultEditRoute: 'content'
    },
    elements: [],
    title: 'SVG',
    categories: ['v4-elements'],
    keywords: ['ato', 'atom', 'atoms', 'atomic'],
    icon: 'eicon-svg',
    widgetType: 'e-svg',
    hideOnSearch: false,
    editSettings: {
      defaultEditRoute: 'content'
    },
    htmlCache: svgHtmlCache
  };
  
  // Add SVG code to settings if available
  if (svgCode) {
    svgElement.settings.svg_code = {
      $$type: 'string',
      value: svgCode
    };
  }

  return svgElement;
};
