/**
 * Elementor Miscellaneous Effects Property Mappers
 */
import { parseSizeValue, createStringValue } from './mapperUtils';

export const elementorMiscEffectsMappers = {
    // Mix Blend Mode
    'mix-blend-mode': (value) => ({
        'mix-blend-mode': createStringValue(value)
    }),

    // Opacity
    'opacity': (value) => {
        const numValue = parseFloat(value);
        let size = numValue;

        // If value is between 0-1, convert to percentage
        if (numValue >= 0 && numValue <= 1) {
            size = numValue * 100;
        }

        return {
            opacity: {
                $$type: 'size',
                value: {
                    size: size,
                    unit: '%'
                }
            }
        };
    },

    // Cursor
    'cursor': (value) => ({
        cursor: createStringValue(value)
    }),

    // Pointer Events
    'pointer-events': (value) => ({
        'pointer-events': createStringValue(value)
    }),

    // User Select
    'user-select': (value) => ({
        'user-select': createStringValue(value)
    }),

    // Visibility
    'visibility': (value) => ({
        visibility: createStringValue(value)
    }),

    // Clip Path
    'clip-path': (value) => ({
        'clip-path': createStringValue(value)
    }),

    // Animation
    'animation': (value) => ({
        animation: createStringValue(value)
    }),
    'animation-name': (value) => ({
        'animation-name': createStringValue(value)
    }),
    'animation-duration': (value) => ({
        'animation-duration': parseSizeValue(value)
    }),
    'animation-delay': (value) => ({
        'animation-delay': parseSizeValue(value)
    }),
    'animation-iteration-count': (value) => ({
        'animation-iteration-count': createStringValue(value)
    }),
    'animation-timing-function': (value) => ({
        'animation-timing-function': createStringValue(value)
    }),
    'animation-fill-mode': (value) => ({
        'animation-fill-mode': createStringValue(value)
    }),

    // Will Change
    'will-change': (value) => ({
        'will-change': createStringValue(value)
    })
};
