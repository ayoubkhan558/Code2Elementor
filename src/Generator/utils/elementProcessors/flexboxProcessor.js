import { getUniqueId } from '../utils';
import { getElementLabel } from './labelUtils';

/**
 * Processes flexbox container elements for Elementor conversion
 * @param {Node} node - The DOM node to process
 * @param {Object} element - The element object to populate
 * @param {string} tag - The HTML tag name
 * @param {Object} context - Optional context values (showNodeClass, etc.)
 * @returns {Object} The processed element
 */
export const processFlexboxElement = (node, element, tag, context = {}) => {
  // Generate unique ID for the flexbox element
  const elementId = getUniqueId();

  // Create Elementor flexbox structure
  const flexboxElement = {
    id: elementId,
    elType: 'e-flexbox',
    isInner: false,
    isLocked: false,
    settings: {
      _element_id: node.id || ''
    },
    defaultEditSettings: {
      defaultEditRoute: 'content'
    },
    elements: [],
    title: 'Flexbox',
    categories: ['v4-elements'],
    keywords: ['ato', 'atom', 'atoms', 'atomic'],
    icon: 'eicon-flexbox',
    widgetType: '',
    hideOnSearch: false,
    editSettings: {
      defaultEditRoute: 'content'
    },
    htmlCache: null
  };

  // Add classes if element has CSS classes
  const classList = node.classList ? Array.from(node.classList) : [];
  // Generate a class ID for styling (used whether or not element has classes)
  const classId = `e-${elementId}-${Math.random().toString(36).substr(2, 7)}`;

  if (classList.length > 0 || true) { // Always add classes for flexbox
    flexboxElement.settings.classes = {
      $$type: 'classes',
      value: [classId]
    };

    // Add styles object for local class styling
    flexboxElement.styles = {
      [classId]: {
        id: classId,
        label: 'local',
        type: 'class',
        variants: [
          {
            meta: {
              breakpoint: 'desktop',
              state: null
            },
            props: {},
            custom_css: null
          }
        ]
      }
    };
  }

  return flexboxElement;
};
