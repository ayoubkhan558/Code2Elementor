/**
 * Elementor Effects Property Mappers
 * Converts CSS effects properties to Elementor's JSON format
 */

/**
 * Parse size value with unit
 */
const parseSizeValue = (value) => {
  if (!value || value === 'auto' || value === 'none') {
    return {
      $$type: 'size',
      value: {
        size: '',
        unit: 'auto'
      }
    };
  }

  if (value.includes('calc(') || value.includes('var(')) {
    return {
      $$type: 'size',
      value: {
        size: value,
        unit: 'custom'
      }
    };
  }

  const match = value.match(/^([+-]?[\d.]+)([a-z%]+)$/i);
  if (match) {
    const size = parseFloat(match[1]);
    const unit = match[2];
    return {
      $$type: 'size',
      value: {
        size: size,
        unit: unit
      }
    };
  }

  const numValue = parseFloat(value);
  if (!isNaN(numValue)) {
    return {
      $$type: 'size',
      value: {
        size: numValue,
        unit: 'px'
      }
    };
  }

  return {
    $$type: 'size',
    value: {
      size: '',
      unit: 'auto'
    }
  };
};

/**
 * Parse box-shadow value
 */
const parseBoxShadow = (value) => {
  const shadows = [];
  
  // Simple regex to extract shadow parts
  // Format: [inset] h-offset v-offset blur spread color
  const regex = /(inset)?\s*([+-]?\d+(?:\.\d+)?[a-z]*)\s+([+-]?\d+(?:\.\d+)?[a-z]*)\s+([+-]?\d+(?:\.\d+)?[a-z]*)?\s*([+-]?\d+(?:\.\d+)?[a-z]*)?\s*(rgba?\([^)]+\)|#[0-9a-f]{3,8}|[a-z]+)?/gi;
  
  let match;
  while ((match = regex.exec(value)) !== null) {
    const [_, inset, hOffset, vOffset, blur, spread, color] = match;
    
    shadows.push({
      $$type: 'shadow',
      value: {
        hOffset: parseSizeValue(hOffset || '0'),
        vOffset: parseSizeValue(vOffset || '0'),
        blur: parseSizeValue(blur || '0'),
        spread: parseSizeValue(spread || '0'),
        color: {
          $$type: 'color',
          value: color || 'rgba(0, 0, 0, 1)'
        },
        position: {
          $$type: 'string',
          value: inset ? 'inset' : 'outset'
        }
      }
    });
  }
  
  return shadows;
};

/**
 * Parse transform value
 */
const parseTransform = (value) => {
  const functions = [];
  
  // Extract transform functions
  const transformRegex = /(\w+)\(([^)]+)\)/g;
  let match;
  
  while ((match = transformRegex.exec(value)) !== null) {
    const [_, func, args] = match;
    
    if (func === 'skew' || func === 'skewX' || func === 'skewY') {
      const [x, y] = args.split(/,\s*/);
      functions.push({
        $$type: 'transform-skew',
        value: {
          x: parseSizeValue(x || '0deg'),
          y: parseSizeValue(y || '0deg')
        }
      });
    }
    // Add other transform functions as needed
  }
  
  return {
    $$type: 'transform',
    value: {
      'transform-functions': {
        $$type: 'transform-functions',
        value: functions
      }
    }
  };
};

/**
 * Parse transition value
 */
const parseTransition = (value) => {
  const transitions = [];
  
  // Simple parse: property duration timing-function delay
  const parts = value.split(/,\s*/);
  
  parts.forEach(part => {
    const [property, duration] = part.trim().split(/\s+/);
    
    transitions.push({
      $$type: 'selection-size',
      value: {
        selection: {
          $$type: 'key-value',
          value: {
            key: {
              value: property === 'all' ? 'All properties' : property,
              $$type: 'string'
            },
            value: {
              value: property || 'all',
              $$type: 'string'
            }
          }
        },
        size: parseSizeValue(duration || '200ms')
      }
    });
  });
  
  return transitions;
};

/**
 * Parse filter value
 */
const parseFilter = (value) => {
  const filters = [];
  
  const filterRegex = /(\w+)\(([^)]+)\)/g;
  let match;
  
  while ((match = filterRegex.exec(value)) !== null) {
    const [_, func, arg] = match;
    
    let filterObj = {
      $$type: 'css-filter-func',
      value: {
        func: {
          $$type: 'string',
          value: func
        },
        args: null
      }
    };
    
    switch (func) {
      case 'blur':
        filterObj.value.args = {
          $$type: 'blur',
          value: {
            size: parseSizeValue(arg)
          }
        };
        break;
        
      case 'brightness':
      case 'contrast':
      case 'saturate':
        filterObj.value.args = {
          $$type: 'intensity',
          value: {
            size: parseSizeValue(arg)
          }
        };
        break;
        
      case 'hue-rotate':
        filterObj.value.args = {
          $$type: 'hue-rotate',
          value: {
            size: parseSizeValue(arg)
          }
        };
        break;
        
      case 'grayscale':
      case 'invert':
      case 'sepia':
        filterObj.value.args = {
          $$type: 'color-tone',
          value: {
            size: parseSizeValue(arg)
          }
        };
        break;
        
      case 'drop-shadow':
        // Parse: h-offset v-offset blur color
        const shadowParts = arg.match(/([+-]?\d+(?:\.\d+)?[a-z]*)\s+([+-]?\d+(?:\.\d+)?[a-z]*)\s+([+-]?\d+(?:\.\d+)?[a-z]*)?\s*(rgba?\([^)]+\)|#[0-9a-f]{3,8})?/i);
        if (shadowParts) {
          filterObj.value.args = {
            $$type: 'drop-shadow',
            value: {
              blur: parseSizeValue(shadowParts[3] || '0'),
              xAxis: parseSizeValue(shadowParts[1] || '0'),
              yAxis: parseSizeValue(shadowParts[2] || '0'),
              color: {
                $$type: 'color',
                value: shadowParts[4] || 'rgba(0, 0, 0, 1)'
              }
            }
          };
        }
        break;
    }
    
    filters.push(filterObj);
  }
  
  return filters;
};

/**
 * Elementor Effects Mappers
 */
export const elementorEffectsMappers = {
  // Mix Blend Mode
  'mix-blend-mode': (value) => {
    return {
      'mix-blend-mode': {
        $$type: 'string',
        value: value
      }
    };
  },

  // Opacity
  'opacity': (value) => {
    const numValue = parseFloat(value);
    let size = numValue;
    let unit = '%';
    
    // If value is between 0-1, convert to percentage
    if (numValue >= 0 && numValue <= 1) {
      size = numValue * 100;
    }
    
    return {
      opacity: {
        $$type: 'size',
        value: {
          size: size,
          unit: unit
        }
      }
    };
  },

  // Box Shadow
  'box-shadow': (value) => {
    const shadows = parseBoxShadow(value);
    return {
      'box-shadow': {
        $$type: 'box-shadow',
        value: shadows
      }
    };
  },

  // Transform
  'transform': (value) => {
    return {
      transform: parseTransform(value)
    };
  },

  // Transition
  'transition': (value) => {
    const transitions = parseTransition(value);
    return {
      transition: {
        $$type: 'transition',
        value: transitions
      }
    };
  },

  // Filter
  'filter': (value) => {
    const filters = parseFilter(value);
    return {
      filter: {
        $$type: 'filter',
        value: filters
      }
    };
  }
};
