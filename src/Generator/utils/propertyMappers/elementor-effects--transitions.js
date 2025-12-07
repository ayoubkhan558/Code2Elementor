/**
 * Elementor Transition Property Mappers
 */
import { parseSizeValue, createStringValue } from './mapperUtils';

/**
 * Parse transition value
 */
const parseTransition = (value) => {
    const transitions = [];

    // Split multiple transitions
    const parts = value.split(/,\s*(?![^(]*\))/);

    parts.forEach(part => {
        const [property, duration, timing, delay] = part.trim().split(/\s+/);

        transitions.push({
            $$type: 'selection-size',
            value: {
                selection: {
                    $$type: 'key-value',
                    value: {
                        key: createStringValue(property === 'all' ? 'All properties' : property),
                        value: createStringValue(property || 'all')
                    }
                },
                size: parseSizeValue(duration || '200ms')
            }
        });
    });

    return transitions;
};

export const elementorTransitionMappers = {
    // Transition
    'transition': (value) => {
        if (!value || value === 'none') {
            return {};
        }
        const transitions = parseTransition(value);
        if (transitions.length === 0) {
            return {};
        }
        return {
            transition: {
                $$type: 'transition',
                value: transitions
            }
        };
    }
};
