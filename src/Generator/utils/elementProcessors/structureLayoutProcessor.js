import { getUniqueId } from '../utils';
import { getElementLabel } from './labelUtils';

/**
 * Processes structural/layout elements (div, section, header, footer, etc.)
 * @param {Node} node - The DOM node to process
 * @param {Object} element - The element object to populate
 * @param {string} tag - The HTML tag name
 * @param {Object} context - Optional context values (showNodeClass, etc.)
 * @returns {Object} The processed element
 */
export const processStructureLayoutElement = (node, element, tag, context = {}) => {
  // Generate unique ID for the div block element
  const elementId = getUniqueId();

  // Supported HTML tags for Elementor Div block: div, header, footer, section, article, aside
  const supportedTags = ['div', 'header', 'footer', 'section', 'article', 'aside', 'main', 'nav'];

  // Determine the appropriate tag
  let htmlTag = 'div';
  if (supportedTags.includes(tag)) {
    htmlTag = tag;
  }

  // Determine title based on tag
  const tagTitles = {
    'div': 'Div block',
    'header': 'Header',
    'footer': 'Footer',
    'section': 'Section',
    'article': 'Article',
    'aside': 'Aside',
    'main': 'Main',
    'nav': 'Navigation'
  };
  const title = tagTitles[htmlTag] || 'Div block';

  // Create Elementor div block structure
  const divElement = {
    id: elementId,
    elType: 'e-div-block',
    isInner: false,
    isLocked: false,
    settings: {
      _element_id: node.id || ''
    },
    defaultEditSettings: {
      defaultEditRoute: 'content'
    },
    elements: [],
    title: title,
    categories: ['v4-elements'],
    keywords: ['ato', 'atom', 'atoms', 'atomic'],
    icon: 'eicon-div-block',
    widgetType: '',
    hideOnSearch: false,
    editSettings: {
      defaultEditRoute: 'content'
    },
    // Add label from class name or tag
    editor_settings: {
      title: getElementLabel(node, title, context)
    },
    htmlCache: null
  };

  // Add tag setting if not default div
  if (htmlTag !== 'div') {
    divElement.settings.tag = {
      $$type: 'string',
      value: htmlTag
    };
  }

  // Add classes if element has CSS classes
  const classList = node.classList ? Array.from(node.classList) : [];
  if (classList.length > 0) {
    // Generate a global class ID for styling
    const globalClassId = `g-${Math.random().toString(36).substr(2, 7)}`;
    divElement.settings.classes = {
      $$type: 'classes',
      value: [globalClassId]
    };
  }

  return divElement;
};
