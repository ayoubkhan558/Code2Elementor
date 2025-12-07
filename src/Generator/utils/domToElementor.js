import { getUniqueId } from './utils';
import { buildCssMap, parseCssDeclarations, matchCSSSelectors } from './cssParser';
import { processImageElement } from './elementProcessors/imageProcessor';
import { processSvgElement } from './elementProcessors/svgProcessor';
import { processHeadingElement } from './elementProcessors/headingProcessor';
import { processButtonElement } from './elementProcessors/buttonProcessor';
import { processStructureLayoutElement } from './elementProcessors/structureLayoutProcessor';
import { getElementLabel } from './elementProcessors/labelUtils';
import { processTextElement } from './elementProcessors/textElementProcessor';
import { processParagraphElement } from './elementProcessors/paragraphProcessor';
import { processAttributes } from './processors/attributeProcessor';
import { processYoutubeElement } from './elementProcessors/youtubeProcessor';
import { processDividerElement } from './elementProcessors/dividerProcessor';
import { processFlexboxElement } from './elementProcessors/flexboxProcessor';

// Context values will be passed as parameters to the functions
/**
 * Converts inline styles to a CSS class
 * @param {string} styleString - The inline style string (e.g., 'color: red; font-size: 16px;')
 * @returns {Object} - Object containing className and CSS rules
 */
const convertStylesToClass = (styleString) => {
  if (!styleString) return { className: '', css: '' };

  // Generate a unique class name
  const className = `elementor-style-${Math.random().toString(36).substr(2, 8)}`;

  // Convert style string to CSS rules
  const rules = styleString
    .split(';')
    .filter(rule => rule.trim() !== '')
    .map(rule => {
      const [property, value] = rule.split(':').map(part => part.trim());
      return property && value ? `${property}: ${value};` : '';
    })
    .filter(Boolean)
    .join('\n  ');

  const css = `.${className} {\n  ${rules}\n}`;

  return { className, css };
};

// Helper function to check if element has container/layout classes
const hasContainerClasses = (node) => {
  if (!node.classList || node.classList.length === 0) return false;

  const containerClasses = ['container', 'boxed', 'wrapper', 'content'];
  return containerClasses.some(cls => node.classList.contains(cls));
};

const handleInlineStyles = (node, element, globalClasses, variables = {}, options = {}) => {

  const styleAttr = node.getAttribute('style');
  console.log('111 Inline styles for element:', options?.context?.inlineStyleHandling);
  if (!styleAttr || !styleAttr.trim()) return;

  switch (options?.context?.inlineStyleHandling) {
    case 'skip':
      // Do nothing - skip the inline styles completely
      console.log('Skipping inline styles for element:', element.id);
      // Remove the style attribute
      node.removeAttribute('style');
      break;

    case 'inline':
      // This case is now handled in processAttributes
      console.log('Inline styles handled in processAttributes for element:', element.id);
      break;

    case 'class':
      // Find the first global class for this element
      let targetClass = null;
      if (element.settings._cssGlobalClasses && element.settings._cssGlobalClasses.length > 0) {
        const firstClassId = element.settings._cssGlobalClasses[0];
        targetClass = globalClasses.find(c => c.id === firstClassId);
      }

      // Convert inline styles to a class and merge with existing settings
      console.log('Converting inline styles to class for element:', element.id, styleAttr, targetClass?.name, variables);

      if (targetClass) {
        // Parse the inline styles
        const parsedInlineStyles = parseCssDeclarations(styleAttr, targetClass.name, variables);

        // Ensure _typography exists in the target class
        if (!targetClass.settings._typography) {
          targetClass.settings._typography = {};
        }

        // Deep merge the inline styles with existing styles
        if (parsedInlineStyles._typography) {
          targetClass.settings._typography = {
            ...targetClass.settings._typography, // Keep existing typography
            ...parsedInlineStyles._typography,   // Apply inline styles on top
          };
        }

        // Merge any other settings (like _cssCustom, etc.)
        Object.entries(parsedInlineStyles).forEach(([key, value]) => {
          if (key !== '_typography') {
            if (targetClass.settings[key] && typeof targetClass.settings[key] === 'object' && !Array.isArray(targetClass.settings[key])) {
              // Merge objects
              targetClass.settings[key] = {
                ...targetClass.settings[key],
                ...value
              };
            } else {
              // Overwrite primitives and arrays
              targetClass.settings[key] = value;
            }
          }
        });
      } else {
        console.warn('No target class found for inline styles conversion');
      }

      // Remove the style attribute since we've processed it
      node.removeAttribute('style');
      break;

    default:
      console.warn('Unknown inlineStyleHandling value:', options?.context?.inlineStyleHandling);
      break;
  }
};

/**
 * Processes a DOM node and converts it to an Elementor element
 */
const domNodeToElementor = (node, cssRulesMap = {}, parentId = '0', globalClasses = [], allElements = [], variables = {}, options = {}) => {
  // Get context values from options with defaults
  const {
    inlineStyleHandling = 'inline',
    cssTarget = 'class',
    showNodeClass = false
  } = options.context || {};
  // Debug logs
  console.log('Context in domNodeToElementor:', { showNodeClass, inlineStyleHandling, cssTarget });
  // Handle text nodes
  if (node.nodeType !== Node.ELEMENT_NODE) {
    // Skip all text nodes - they will be captured by their parent elements
    return null;
  }

  const tag = node.tagName.toLowerCase();

  // -------------------------------------------------------------------
  // Skip empty placeholder elements automatically injected by the HTML
  // parser when the source markup is invalid (e.g. a <p> that ends up
  // empty because the browser closed it before a disallowed child like
  // <address>). These empty nodes generate redundant Elementor elements and
  // should be ignored completely.
  // -------------------------------------------------------------------
  // Skip empty placeholder elements automatically injected by the HTML
  // parser when the source markup is invalid, but preserve divs with classes
  if (['p', 'span'].includes(tag) && node.textContent.trim() === '' && node.children.length === 0) {
    return null;
  }

  // Include all divs in the output, even empty ones
  // We'll handle empty divs by setting appropriate defaults

  const elementId = getUniqueId();
  let element = null;

  // Check if this is a standalone inline element that should be converted to text-basic
  const isStandaloneInline = ['strong', 'em', 'small', 'blockquote'].includes(tag) &&
    node.parentElement &&
    !['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'section', 'article', 'aside', 'header', 'footer'].includes(node.parentElement.tagName.toLowerCase());

  if (isStandaloneInline) {
    element = processTextElement(node, { id: elementId }, tag, allElements, options.context || {});
    if (element) {
      allElements.push(element);
      return element;
    }
  }

  // Process anchor tags as buttons
  if (tag === 'a') {
    element = processButtonElement(node, { id: elementId }, tag, options.context || {});
  }
  // Check for flexbox containers
  else if ((tag === 'div' && node.style.display === 'flex') ||
    node.classList.contains('flex') ||
    node.classList.contains('flexbox') ||
    node.classList.contains('d-flex')) {
    element = processFlexboxElement(node, { id: elementId }, tag, options.context || {});
  }
  // Structure/layout elements (Div block)
  else if (tag === 'section' ||
    node.classList.contains('container') ||
    node.classList.contains('row') ||
    node.classList.contains('col-') ||
    node.classList.contains('section') ||
    (tag === 'div' && hasContainerClasses(node))) {
    element = processStructureLayoutElement(node, { id: elementId }, tag, options.context || {});
  }
  else if (tag === 'div') {
    // Process as generic div if no special classes are present
    element = processStructureLayoutElement(node, { id: elementId }, 'div', options.context || {});
  }
  // Heading elements
  else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
    element = processHeadingElement(node, { id: elementId }, tag, options.context || {});
  }
  // Paragraph elements
  else if (tag === 'p') {
    element = processParagraphElement(node, { id: elementId }, tag, options.context || {});
  }
  // Other text elements
  else if (['time', 'mark', 'span', 'address', 'blockquote'].includes(tag)) {
    element = processTextElement(node, { id: elementId }, tag, allElements, options.context || {});
  }
  // Image elements
  else if (tag === 'img') {
    element = processImageElement(node, { id: elementId }, tag, options.context || {});
  }
  // Button elements
  else if (tag === 'button') {
    element = processButtonElement(node, { id: elementId }, tag, options.context || {});
  }
  // SVG elements
  else if (tag === 'svg') {
    element = processSvgElement(node, { id: elementId }, tag, options.context || {});
  }
  // YouTube/Video elements
  else if (tag === 'iframe' && (node.src?.includes('youtube.com') || node.src?.includes('youtu.be'))) {
    element = processYoutubeElement(node, { id: elementId }, tag, options.context || {});
  }
  // Divider elements (hr tag)
  else if (tag === 'hr' || node.classList.contains('divider') || node.classList.contains('separator')) {
    element = processDividerElement(node, { id: elementId }, tag, options.context || {});
  }
  else {
    // Fallback to div block for unknown elements
    element = processStructureLayoutElement(node, { id: elementId }, tag, options.context || {});
  }

  if (!element) {
    return null;
  }

  // Process children - skip for elements that handle their own content
  if (!element._skipTextNodes && !element._skipChildren && element.elements !== undefined) {
    Array.from(node.childNodes).forEach(childNode => {
      // Skip empty text nodes
      if (childNode.nodeType === Node.TEXT_NODE && !childNode.textContent.trim()) {
        return;
      }
      // Skip processing text nodes for elements that handle their own text content
      if (element._skipTextNodes && childNode.nodeType === Node.TEXT_NODE) {
        return;
      }
      const childElement = domNodeToElementor(childNode, cssRulesMap, elementId, globalClasses, allElements, variables, options);
      if (childElement && childElement.id) {
        element.elements.push(childElement);
      }
    });
  }

  // Handle CSS classes for Elementor
  const existingClasses = node.classList && node.classList.length > 0 ? Array.from(node.classList) : [];
  if (existingClasses.length > 0) {
    const globalClassId = `g-${Math.random().toString(36).substr(2, 7)}`;
    if (!element.settings.classes) {
      element.settings.classes = {
        $$type: 'classes',
        value: [globalClassId]
      };
    }
  }

  // Clean up temporary flags
  delete element._skipTextNodes;
  delete element._skipChildren;

  return element;
};

/**
 * Converts HTML and CSS to Elementor structure
 */
const convertHtmlToElementor = (html, css, options) => {
  try {
    let doc;
    if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
      const parser = new DOMParser();
      doc = parser.parseFromString(html, 'text/html');
    } else {
      const { JSDOM } = require('jsdom');
      const dom = new JSDOM(`<!DOCTYPE html>${html}`);
      doc = dom.window.document;
      if (typeof global.Node === 'undefined') global.Node = dom.window.Node;
    }

    const { cssMap, variables, rootStyles } = buildCssMap(css);

    const content = [];
    const globalClasses = [];
    const allElements = [];

    const processNodes = nodeList => {
      Array.from(nodeList).forEach(node => {
        const element = domNodeToElementor(
          node,
          cssMap,
          '0',
          globalClasses,
          allElements,
          variables,
          {
            ...options,
            context: {
              ...options.context, // Spread existing context first
              showNodeClass: options.context?.showNodeClass || false,
              inlineStyleHandling: options.context?.inlineStyleHandling || 'inline',
              cssTarget: options.context?.cssTarget || 'class',
              activeTab: options.context?.activeTab || 'html'
            }
          }
        );
        if (element) {
          if (Array.isArray(element)) {
            content.push(...element);
          } else {
            content.push(element);
          }
        }
      });
    };

    processNodes(doc.body.childNodes);
    // Also process head nodes like <script> when body is empty
    if (content.length === 0) {
      processNodes(doc.head.childNodes);
    }

    // Wrap single non-container elements in a container
    // Check if we need to wrap content in a container
    const needsWrapper = content.length > 0 && content.some(el =>
      el.elType === 'widget' || // widgets should be inside containers
      (el.elType !== 'e-div-block' && el.elType !== 'e-flexbox') // non-container elements
    );

    let finalContent = content;
    if (needsWrapper && content.length > 0 && content[0].elType !== 'e-div-block' && content[0].elType !== 'e-flexbox') {
      // Wrap all content in a container
      const containerId = getUniqueId();
      const containerElement = {
        id: containerId,
        elType: 'e-div-block',
        isInner: false,
        isLocked: false,
        settings: {},
        defaultEditSettings: {
          defaultEditRoute: 'content'
        },
        elements: content,
        title: 'Container',
        categories: ['v4-elements'],
        keywords: ['ato', 'atom', 'atoms', 'atomic'],
        icon: 'eicon-div-block',
        widgetType: '',
        hideOnSearch: false,
        editSettings: {
          defaultEditRoute: 'content'
        },
        htmlCache: null
      };
      finalContent = [containerElement];
    }

    if (rootStyles) {
      // Split the combined root styles back into individual root blocks
      const rootBlocks = rootStyles.split(';').filter(block => block.trim() !== '');

      // Create a single root block with all variables
      const combinedRootStyles = `:root {\n  ${rootBlocks.join(';\n  ')};\n}`;

      if (globalClasses.length > 0) {
        const firstClass = globalClasses[0];
        if (!firstClass.settings._cssCustom) {
          firstClass.settings._cssCustom = '';
        }
        firstClass.settings._cssCustom = `${combinedRootStyles}\n${firstClass.settings._cssCustom}`;
      } else {
        globalClasses.push({
          id: getUniqueId(),
          name: 'custom-css',
          settings: {
            _cssCustom: combinedRootStyles,
          },
        });
      }
    }

    return {
      type: 'elementor',
      siteurl: 'http://localhost/wp-json/',
      elements: finalContent,
      globalClasses: globalClasses
    };
  } catch (error) {
    console.error('Error converting HTML to Elementor:', error);
    throw error;
  }
};

export { domNodeToElementor, convertHtmlToElementor };