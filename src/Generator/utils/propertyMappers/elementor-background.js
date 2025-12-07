/**
 * Elementor Background Property Mappers
 * Converts CSS background properties to Elementor's JSON format
 * 
 * Reference format:
 * {
 *   "background": {
 *     "$$type": "background",
 *     "value": {
 *       "color": { "$$type": "color", "value": "#da5656" },
 *       "clip": { "$$type": "string", "value": "border-box" },
 *       "background-overlay": {
 *         "$$type": "background-overlay",
 *         "value": [{ "$$type": "background-gradient-overlay", ... }]
 *       }
 *     }
 *   }
 * }
 */
import { createStringValue, createColorValue, createNumberValue } from './mapperUtils';

/**
 * Parse gradient string to extract type, angle, and color stops
 * Supports: linear-gradient, radial-gradient
 */
const parseGradient = (gradientString) => {
    if (!gradientString) return null;

    // Detect gradient type
    const linearMatch = gradientString.match(/linear-gradient\((.*)\)/i);
    const radialMatch = gradientString.match(/radial-gradient\((.*)\)/i);

    if (!linearMatch && !radialMatch) {
        return null;
    }

    const isLinear = !!linearMatch;
    const content = (linearMatch || radialMatch)[1];

    let angle = 180; // Default angle for linear
    let colorStopsString = content;

    // Extract angle if linear gradient
    if (isLinear) {
        // Check for degree angle: "180deg, ..."
        const angleMatch = content.match(/^(-?\d+)deg\s*,\s*/);
        if (angleMatch) {
            angle = parseInt(angleMatch[1], 10);
            colorStopsString = content.substring(angleMatch[0].length);
        } else {
            // Handle direction keywords: "to bottom, ..."
            const directionMatch = content.match(/^to\s+(top|bottom|left|right)(?:\s+(top|bottom|left|right))?\s*,\s*/i);
            if (directionMatch) {
                const dir = directionMatch[0].toLowerCase();
                if (dir.includes('bottom')) angle = 180;
                else if (dir.includes('top')) angle = 0;
                else if (dir.includes('right')) angle = 90;
                else if (dir.includes('left')) angle = 270;
                colorStopsString = content.substring(directionMatch[0].length);
            }
        }
    }

    // Parse color stops - format: "color percentage"
    // Matches: rgba(r,g,b,a) 50%, #fff 0%, red 100%
    const stops = [];

    // Split by comma, but not inside parentheses
    const parts = colorStopsString.split(/,(?![^(]*\))/);

    parts.forEach(part => {
        const trimmed = part.trim();
        if (!trimmed) return;

        // Match: color [percentage]
        // Color can be: rgba(...), rgb(...), #hex, named color
        const colorStopMatch = trimmed.match(/^(rgba?\([^)]+\)|#[0-9a-f]{3,8}|[a-z-]+)\s*(\d+)?%?$/i);

        if (colorStopMatch) {
            const color = colorStopMatch[1];
            const offset = colorStopMatch[2] ? parseInt(colorStopMatch[2], 10) : (stops.length === 0 ? 0 : 100);

            stops.push({
                $$type: 'color-stop',
                value: {
                    color: createColorValue(color),
                    offset: createNumberValue(offset)
                }
            });
        }
    });

    // Need at least 2 stops for a gradient
    if (stops.length < 2) {
        return null;
    }

    return {
        type: isLinear ? 'linear' : 'radial',
        angle: angle,
        stops: stops
    };
};

/**
 * Create background overlay structure for gradients
 */
const createGradientOverlay = (gradient) => {
    return {
        $$type: 'background-overlay',
        value: [
            {
                $$type: 'background-gradient-overlay',
                value: {
                    type: createStringValue(gradient.type),
                    angle: createNumberValue(gradient.angle),
                    stops: {
                        $$type: 'gradient-color-stop',
                        value: gradient.stops
                    }
                }
            }
        ]
    };
};

/**
 * Elementor Background Mappers
 */
export const elementorBackgroundMappers = {
    // Background (shorthand) - handles color, gradient, and clip
    'background': (value) => {
        if (!value || value === 'none' || value === 'transparent') {
            return {};
        }

        const backgroundValue = {};

        // Check for gradient first
        if (value.includes('gradient')) {
            const gradient = parseGradient(value);
            if (gradient) {
                backgroundValue['background-overlay'] = createGradientOverlay(gradient);
            }
        }

        // Extract background color (if not a gradient)
        if (!value.includes('gradient')) {
            // Match colors: #hex, rgb(), rgba(), named colors (but not keywords like "none", "url", etc.)
            const colorMatch = value.match(/(#[0-9a-f]{3,8}|rgba?\([^)]+\))/i);
            if (colorMatch) {
                backgroundValue.color = createColorValue(colorMatch[1]);
            }
        }

        // If nothing was extracted, return empty
        if (Object.keys(backgroundValue).length === 0) {
            return {};
        }

        return {
            background: {
                $$type: 'background',
                value: backgroundValue
            }
        };
    },

    // Background Color
    'background-color': (value) => {
        if (!value || value === 'transparent' || value === 'inherit') {
            return {};
        }
        return {
            background: {
                $$type: 'background',
                value: {
                    color: createColorValue(value)
                }
            }
        };
    },

    // Background Image (gradient or URL)
    'background-image': (value) => {
        if (!value || value === 'none') {
            return {};
        }

        // Handle gradients
        if (value.includes('gradient')) {
            const gradient = parseGradient(value);
            if (gradient) {
                return {
                    background: {
                        $$type: 'background',
                        value: {
                            'background-overlay': createGradientOverlay(gradient)
                        }
                    }
                };
            }
        }

        // Handle URL images - just store the URL, Elementor will process it
        if (value.includes('url(')) {
            const urlMatch = value.match(/url\(['"]?([^'"()]+)['"]?\)/);
            if (urlMatch) {
                return {
                    background: {
                        $$type: 'background',
                        value: {
                            image: createStringValue(urlMatch[1])
                        }
                    }
                };
            }
        }

        return {};
    },

    // Background Clip
    'background-clip': (value) => {
        if (!value) return {};
        return {
            background: {
                $$type: 'background',
                value: {
                    clip: createStringValue(value)
                }
            }
        };
    },

    // -webkit-background-clip (alias)
    '-webkit-background-clip': (value) => {
        if (!value) return {};
        return {
            background: {
                $$type: 'background',
                value: {
                    clip: createStringValue(value)
                }
            }
        };
    },

    // Background Size
    'background-size': (value) => {
        if (!value) return {};
        return {
            'background-size': createStringValue(value)
        };
    },

    // Background Position
    'background-position': (value) => {
        if (!value) return {};
        return {
            'background-position': createStringValue(value)
        };
    },

    // Background Repeat
    'background-repeat': (value) => {
        if (!value) return {};
        return {
            'background-repeat': createStringValue(value)
        };
    },

    // Background Attachment
    'background-attachment': (value) => {
        if (!value) return {};
        return {
            'background-attachment': createStringValue(value)
        };
    },

    // Background Origin
    'background-origin': (value) => {
        if (!value) return {};
        return {
            'background-origin': createStringValue(value)
        };
    },

    // Background Blend Mode
    'background-blend-mode': (value) => {
        if (!value) return {};
        return {
            'background-blend-mode': createStringValue(value)
        };
    }
};
