/**
 * Elementor Background Property Mappers
 * Converts CSS background properties to Elementor's JSON format
 */

/**
 * Parse gradient string to extract type, angle, and color stops
 */
const parseGradient = (gradientString) => {
  // Detect gradient type
  const linearMatch = gradientString.match(/linear-gradient\((.*)\)/);
  const radialMatch = gradientString.match(/radial-gradient\((.*)\)/);
  
  if (!linearMatch && !radialMatch) {
    return null;
  }

  const isLinear = !!linearMatch;
  const content = (linearMatch || radialMatch)[1];
  
  let angle = 180; // Default angle for linear
  let colorStopsString = content;

  // Extract angle if linear gradient
  if (isLinear) {
    const angleMatch = content.match(/^(\d+)deg,\s*/);
    if (angleMatch) {
      angle = parseInt(angleMatch[1], 10);
      colorStopsString = content.substring(angleMatch[0].length);
    }
  }

  // Parse color stops
  const stops = [];
  const colorStopPattern = /(rgba?\([^)]+\)|#[0-9a-f]{3,8}|[a-z]+)\s+(\d+)%/gi;
  let match;
  
  while ((match = colorStopPattern.exec(colorStopsString)) !== null) {
    stops.push({
      $$type: 'color-stop',
      value: {
        color: {
          $$type: 'color',
          value: match[1]
        },
        offset: {
          $$type: 'number',
          value: parseInt(match[2], 10)
        }
      }
    });
  }

  return {
    type: isLinear ? 'linear' : 'radial',
    angle: angle,
    stops: stops
  };
};

/**
 * Elementor Background Mappers
 */
export const elementorBackgroundMappers = {
  // Background (shorthand)
  'background': (value) => {
    const result = {
      background: {
        $$type: 'background',
        value: {}
      }
    };

    // Check for gradient
    if (value.includes('gradient')) {
      const gradient = parseGradient(value);
      if (gradient) {
        result.background.value['background-overlay'] = {
          $$type: 'background-overlay',
          value: [
            {
              $$type: 'background-gradient-overlay',
              value: {
                type: {
                  $$type: 'string',
                  value: gradient.type
                },
                angle: {
                  $$type: 'number',
                  value: gradient.angle
                },
                stops: {
                  $$type: 'gradient-color-stop',
                  value: gradient.stops
                }
              }
            }
          ]
        };
      }
    }

    // Extract background color (not from gradient)
    const colorMatch = value.match(/(#[0-9a-f]{3,8}|rgba?\([^)]+\)|[a-z]+)(?!\s+\d+%)/i);
    if (colorMatch && !value.includes('gradient')) {
      result.background.value.color = {
        $$type: 'color',
        value: colorMatch[1]
      };
    }

    // Check for background-clip: text
    if (value.includes('text') || value.includes('-webkit-background-clip')) {
      result.background.value.clip = {
        $$type: 'string',
        value: 'text'
      };
    }

    return result;
  },

  // Background Color
  'background-color': (value) => {
    return {
      background: {
        $$type: 'background',
        value: {
          color: {
            $$type: 'color',
            value: value
          }
        }
      }
    };
  },

  // Background Image (gradient)
  'background-image': (value) => {
    if (value.includes('gradient')) {
      const gradient = parseGradient(value);
      if (gradient) {
        return {
          background: {
            $$type: 'background',
            value: {
              'background-overlay': {
                $$type: 'background-overlay',
                value: [
                  {
                    $$type: 'background-gradient-overlay',
                    value: {
                      type: {
                        $$type: 'string',
                        value: gradient.type
                      },
                      angle: {
                        $$type: 'number',
                        value: gradient.angle
                      },
                      stops: {
                        $$type: 'gradient-color-stop',
                        value: gradient.stops
                      }
                    }
                  }
                ]
              }
            }
          }
        };
      }
    }

    // Handle URL images
    if (value.includes('url(')) {
      const urlMatch = value.match(/url\(['"]?([^'"()]+)['"]?\)/);
      if (urlMatch) {
        return {
          background: {
            $$type: 'background',
            value: {
              image: {
                $$type: 'string',
                value: urlMatch[1]
              }
            }
          }
        };
      }
    }

    return {};
  },

  // Background Clip
  'background-clip': (value) => {
    return {
      background: {
        $$type: 'background',
        value: {
          clip: {
            $$type: 'string',
            value: value
          }
        }
      }
    };
  },

  // -webkit-background-clip
  '-webkit-background-clip': (value) => {
    return {
      background: {
        $$type: 'background',
        value: {
          clip: {
            $$type: 'string',
            value: value
          }
        }
      }
    };
  }
};
