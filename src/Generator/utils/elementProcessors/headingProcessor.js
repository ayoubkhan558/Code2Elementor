import { getUniqueId } from '../utils';
import { getElementLabel } from './labelUtils';

/**
 * Processes heading elements (h1-h6) for Elementor conversion
 * @param {Node} node - The DOM node to process
 * @param {Object} element - The element object to populate
 * @param {string} tag - The HTML tag name (h1-h6)
 * @param {Object} context - Optional context values (showNodeClass, activeTagIndex, etc.)
 * @returns {Object|null} The processed element or null if invalid
 */
export const processHeadingElement = (node, element, tag, context = {}) => {
  if (node.nodeType === Node.TEXT_NODE) {
    return null;
  }

  // Generate unique ID for the heading element
  const elementId = getUniqueId();
  const classId = `e-${elementId}-${Math.random().toString(36).substr(2, 7)}`;
  
  // Extract heading text
  const headingText = node.textContent?.trim() || 'Heading';
  
  // Extract link if heading contains or is wrapped in anchor
  let linkUrl = null;
  let isTargetBlank = null;
  
  // Check if heading contains an anchor tag
  const anchorInside = node.querySelector('a');
  if (anchorInside) {
    linkUrl = anchorInside.getAttribute('href') || null;
    isTargetBlank = anchorInside.getAttribute('target') === '_blank' ? true : null;
  }
  // Check if heading is inside an anchor tag
  else {
    const parentAnchor = node.closest('a');
    if (parentAnchor) {
      linkUrl = parentAnchor.getAttribute('href') || null;
      isTargetBlank = parentAnchor.getAttribute('target') === '_blank' ? true : null;
    }
  }
  
  // Create Elementor heading structure
  const headingElement = {
    id: elementId,
    elType: 'widget',
    isInner: false,
    isLocked: false,
    settings: {
      title: {
        $$type: 'string',
        value: headingText
      },
      tag: {
        $$type: 'string',
        value: tag
      },
      _cssid: {
        $$type: 'string',
        value: node.id || `heading-${elementId}`
      },
      classes: {
        $$type: 'classes',
        value: [classId]
      },
      _element_id: node.id || ''
    },
    defaultEditSettings: {
      defaultEditRoute: 'content'
    },
    elements: [],
    widgetType: 'e-heading',
    styles: {
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
            props: {
              margin: {
                $$type: 'dimensions',
                value: {
                  'block-start': null,
                  'block-end': null,
                  'inline-start': null,
                  'inline-end': null
                }
              }
            },
            custom_css: null
          }
        ]
      }
    },
    editor_settings: {
      title: headingText
    },
    editSettings: {
      defaultEditRoute: 'content'
    },
    htmlCache: ''
  };
  
  // Add link settings if URL exists
  if (linkUrl) {
    headingElement.settings.link = {
      $$type: 'link',
      value: {
        destination: {
          $$type: 'url',
          value: linkUrl
        },
        isTargetBlank: isTargetBlank
      }
    };
  }

  return headingElement;
};
