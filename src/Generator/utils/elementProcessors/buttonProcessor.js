import { getUniqueId } from '../utils';
import { getElementLabel } from './labelUtils';

/**
 * Processes button elements for Elementor conversion
 * @param {Node} node - The DOM node to process
 * @param {Object} element - The element object to populate
 * @param {string} tag - The HTML tag name
 * @param {Object} context - Optional context values (showNodeClass, etc.)
 * @returns {Object} The processed element
 */
export const processButtonElement = (node, element, tag = 'button', context = {}) => {
  // Generate unique ID for the button element
  const elementId = getUniqueId();
  
  // Extract button text
  const buttonText = node.textContent?.trim() || 'Button';
  
  // Extract link if button is wrapped in anchor or has onclick
  let linkUrl = '#';
  let isTargetBlank = false;
  
  // Check if button is inside an anchor tag
  const parentAnchor = node.closest('a');
  if (parentAnchor) {
    linkUrl = parentAnchor.getAttribute('href') || '#';
    isTargetBlank = parentAnchor.getAttribute('target') === '_blank';
  }
  // Check if button itself has a link (like <a> tag styled as button)
  else if (tag === 'a') {
    linkUrl = node.getAttribute('href') || '#';
    isTargetBlank = node.getAttribute('target') === '_blank';
  }
  
  // Create Elementor button structure
  const buttonElement = {
    id: elementId,
    elType: 'widget',
    isInner: false,
    isLocked: false,
    settings: {
      text: {
        $$type: 'string',
        value: buttonText
      },
      _element_id: node.id || ''
    },
    defaultEditSettings: {
      defaultEditRoute: 'content'
    },
    elements: [],
    title: 'Button',
    categories: ['v4-elements'],
    keywords: ['ato', 'atom', 'atoms', 'atomic'],
    icon: 'eicon-e-button',
    widgetType: 'e-button',
    hideOnSearch: false,
    editSettings: {
      defaultEditRoute: 'content'
    },
    editor_settings: {
      title: buttonText
    },
    htmlCache: ''
  };
  
  // Add link settings if URL is not just '#'
  if (linkUrl && linkUrl !== '#') {
    buttonElement.settings.link = {
      $$type: 'link',
      value: {
        destination: {
          $$type: 'url',
          value: linkUrl
        },
        isTargetBlank: {
          $$type: 'boolean',
          value: isTargetBlank
        }
      }
    };
  }

  return buttonElement;
};
