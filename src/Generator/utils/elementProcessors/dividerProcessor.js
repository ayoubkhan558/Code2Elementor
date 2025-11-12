import { getUniqueId } from '../utils';
import { getElementLabel } from './labelUtils';

/**
 * Processes divider/separator elements for Elementor conversion
 * @param {Node} node - The DOM node to process
 * @param {Object} element - The element object to populate
 * @param {string} tag - The HTML tag name
 * @param {Object} context - Optional context values (showNodeClass, etc.)
 * @returns {Object} The processed element
 */
export const processDividerElement = (node, element, tag, context = {}) => {
  // Generate unique ID for the divider element
  const elementId = getUniqueId();
  
  // Create Elementor divider structure
  const dividerElement = {
    id: elementId,
    elType: 'widget',
    isInner: false,
    isLocked: false,
    settings: {
      _cssid: {
        $$type: 'string',
        value: node.id || `divider-${elementId}`
      }
    },
    defaultEditSettings: {
      defaultEditRoute: 'content'
    },
    elements: [],
    widgetType: 'e-divider',
    htmlCache: '<hr class="e-divider-base" />',
    styles: [],
    editor_settings: [],
    editSettings: {
      defaultEditRoute: 'content'
    }
  };

  return dividerElement;
};
