/**
 * Processes paragraph elements into Elementor e-paragraph widget
 * @param {Node} node - The DOM node to process
 * @param {Object} element - The base element object with id
 * @param {string} tag - The HTML tag name
 * @param {Object} context - Optional context values
 * @returns {Object} The processed Elementor paragraph element
 */
export const processParagraphElement = (node, element, tag, context = {}) => {
  const paragraphText = node.textContent.trim();

  // Generate a class ID for styling
  const classId = `g-${Math.random().toString(36).substr(2, 7)}`;

  // Get existing classes from the node
  const classList = node.classList ? Array.from(node.classList) : [];

  const paragraphElement = {
    id: element.id,
    elType: 'widget',
    isInner: false,
    isLocked: false,
    settings: {
      paragraph: {
        $$type: 'string',
        value: paragraphText
      },
      _element_id: node.id || ''
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
    htmlCache: '',
    _skipTextNodes: true,
    _skipChildren: true
  };

  // Add classes if element has CSS classes
  if (classList.length > 0) {
    paragraphElement.settings.classes = {
      $$type: 'classes',
      value: [classId]
    };
  }

  return paragraphElement;
};
