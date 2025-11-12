import { getUniqueId } from '../utils';
import { getElementLabel } from './labelUtils';

/**
 * Processes image elements for Elementor conversion
 * @param {Node} node - The DOM node to process
 * @param {Object} element - The element object to populate
 * @param {string} tag - The HTML tag name
 * @param {Object} context - Optional context values (showNodeClass, etc.)
 * @returns {Object} The processed element
 */
export const processImageElement = (node, element, tag = 'img', context = {}) => {
  // Generate unique ID for the image element
  const elementId = getUniqueId();
  
  // Extract image source
  const imageSrc = node.getAttribute('src') || '';
  const imageAlt = node.getAttribute('alt') || '';
  
  // Create Elementor image structure
  const imageElement = {
    id: elementId,
    elType: 'widget',
    isInner: false,
    isLocked: false,
    settings: {
      image: {
        $$type: 'image',
        value: {
          src: {
            $$type: 'image-src',
            value: {
              id: {
                $$type: 'image-attachment-id',
                value: null // Will be null for external images
              },
              url: imageSrc || null
            }
          }
        }
      },
      _element_id: node.id || ''
    },
    defaultEditSettings: {
      defaultEditRoute: 'content'
    },
    elements: [],
    title: 'Image',
    categories: ['v4-elements'],
    keywords: ['ato', 'atom', 'atoms', 'atomic'],
    icon: 'eicon-e-image',
    widgetType: 'e-image',
    hideOnSearch: false,
    editSettings: {
      defaultEditRoute: 'content'
    },
    htmlCache: ''
  };
  
  // Add alt text if present
  if (imageAlt) {
    imageElement.settings.alt = {
      $$type: 'string',
      value: imageAlt
    };
  }

  return imageElement;
};
