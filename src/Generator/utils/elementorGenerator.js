import { convertHtmlToElementor } from './domToElementor';
import { processJavaScript } from './jsProcessor';

/**
 * Creates an Elementor-compatible structure from HTML, CSS, and JavaScript
 * @param {string} html - The HTML content
 * @param {string} css - The CSS content
 * @param {string} js - The JavaScript content
 * @returns {Object} Elementor structure object
 */
const createElementorStructure = (html, css = '', js = '', options = {}) => {
  try {
    // Convert the provided HTML & CSS into Elementor JSON using tag-based logic
    const result = convertHtmlToElementor(html, css, {
      ...options,
      context: {
        ...(options.context || {}),
        showNodeClass: options.context?.showNodeClass || false,
        inlineStyleHandling: options.context?.inlineStyleHandling || 'inline',
        cssTarget: options.context?.cssTarget || 'class'
      }
    });

    // Optionally process JavaScript additions
    if (js && js.trim()) {
      const rootElement = result.elements.find((el) => el.elType);
      const parentId = rootElement ? rootElement.id : '0';
      const jsElement = processJavaScript(js, parentId);

      if (jsElement) {
        result.elements.push(jsElement);
        // attach as child of parent element
        const parentEl = result.elements.find(el => el.id === parentId);
        if (parentEl && Array.isArray(parentEl.elements)) {
          parentEl.elements.push(jsElement.id);
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Error creating Elementor structure:', error);
    throw error;
  }
};

export { createElementorStructure };
