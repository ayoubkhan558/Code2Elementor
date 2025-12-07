import { getElementLabel } from './labelUtils';
import { getUniqueId } from '../utils';

/**
 * Processes text-related elements (p, span, address, time, mark, blockquote, and text-only divs)
 * @param {Node} node - The DOM node to process
 * @param {Object} element - The element object to populate
 * @param {string} tag - The HTML tag name
 * @param {Array} allElements - Array of all elements being processed
 * @param {Object} context - Optional context values (showNodeClass, etc.)
 * @returns {Object|null} The processed element or null if invalid
 */
export const processTextElement = (node, element, tag, allElements, context = {}) => {
  const textContent = node.textContent.trim();
  const elementId = element.id || getUniqueId();

  // Generate a class ID for styling
  const classId = `e-${elementId}-${Math.random().toString(36).substr(2, 7)}`;

  // Get existing classes from the node
  const classList = node.classList ? Array.from(node.classList) : [];

  // Handle inline elements within paragraphs
  const isInlineInParagraph = ['strong', 'em', 'small'].includes(tag) &&
    node.parentElement?.tagName?.toLowerCase() === 'p';

  if (isInlineInParagraph) {
    // For inline elements inside paragraphs, use paragraph widget
    return {
      id: elementId,
      elType: 'widget',
      isInner: false,
      isLocked: false,
      settings: {
        paragraph: {
          $$type: 'string',
          value: textContent
        },
        _element_id: node.id || ''
      },
      defaultEditSettings: {
        defaultEditRoute: 'content'
      },
      elements: [],
      title: tag === 'strong' ? 'Bold Text' : tag === 'em' ? 'Italic Text' : 'Small Text',
      categories: ['v4-elements'],
      keywords: ['ato', 'atom', 'atoms', 'atomic'],
      icon: 'eicon-paragraph',
      widgetType: 'e-paragraph',
      hideOnSearch: false,
      editSettings: {
        defaultEditRoute: 'content'
      },
      htmlCache: '',
      _skipTextNodes: true,
      _skipChildren: true
    };
  }

  // Get label from class name or default to 'Text'
  const label = getElementLabel(node, 'Text', context);

  // Create base text element structure (works for div, section, span, blockquote, etc.)
  const textElement = {
    id: elementId,
    elType: 'widget',
    isInner: false,
    isLocked: false,
    settings: {
      paragraph: {
        $$type: 'string',
        value: textContent
      },
      _element_id: node.id || '',
      classes: {
        $$type: 'classes',
        value: [classId]
      }
    },
    defaultEditSettings: {
      defaultEditRoute: 'content'
    },
    elements: [],
    title: 'Paragraph',
    categories: ['v4-elements'],
    keywords: ['ato', 'atom', 'atoms', 'atomic'],
    icon: 'eicon-paragraph',
    widgetType: 'e-paragraph',
    hideOnSearch: false,
    editSettings: {
      defaultEditRoute: 'content'
    },
    // Add label from class name
    editor_settings: {
      title: label
    },
    // Add styles object for local class styling
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
            props: {},
            custom_css: null
          }
        ]
      }
    },
    htmlCache: '',
    _skipTextNodes: true,
    _skipChildren: true
  };

  return textElement;
};
