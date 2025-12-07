/**
 * Elementor Transform Property Mappers
 */
import { parseSizeValue, createNumberValue } from './mapperUtils';

/**
 * Parse transform value
 * Supports: rotate, rotateX/Y/Z, scale, scaleX/Y, translate, translateX/Y, skew, skewX/Y
 * Also handles 3D variants: translate3d, rotate3d, scale3d
 */
const parseTransform = (value) => {
    if (!value || value === 'none') {
        return null;
    }

    const functions = [];
    let pendingGroup = null; // { type: 'translate'|'rotate'|'scale'|'skew', value: {x,y,z} }

    const flushPending = () => {
        if (!pendingGroup) return;

        const { type, value } = pendingGroup;

        if (type === 'translate') {
            functions.push({
                $$type: 'transform-translate',
                value: {
                    x: value.x || parseSizeValue('0px'),
                    y: value.y || parseSizeValue('0px')
                }
            });
        } else if (type === 'rotate') {
            functions.push({
                $$type: 'transform-rotate',
                value: {
                    x: value.x || parseSizeValue('0deg'),
                    y: value.y || parseSizeValue('0deg'),
                    z: value.z || parseSizeValue('0deg')
                }
            });
        } else if (type === 'scale') {
            functions.push({
                $$type: 'transform-scale',
                value: {
                    x: value.x || createNumberValue(1),
                    y: value.y || createNumberValue(1)
                }
            });
        } else if (type === 'skew') {
            functions.push({
                $$type: 'transform-skew',
                value: {
                    x: value.x || parseSizeValue('0deg'),
                    y: value.y || parseSizeValue('0deg')
                }
            });
        }

        pendingGroup = null;
    };

    const transformRegex = /([\w-]+)\(([^)]+)\)/g;
    let match;

    while ((match = transformRegex.exec(value)) !== null) {
        const func = match[1];
        const args = match[2];
        const argsList = args.split(',').map(a => a.trim());

        // Determine the type of the current function
        let currentType = '';
        if (func.includes('translate')) currentType = 'translate';
        else if (func.includes('rotate')) currentType = 'rotate';
        else if (func.includes('scale')) currentType = 'scale';
        else if (func.includes('skew')) currentType = 'skew';
        else continue; // Skip unsupported

        // If type changed, flush previous group
        if (pendingGroup && pendingGroup.type !== currentType) {
            flushPending();
        }

        // Initialize new group if needed
        if (!pendingGroup) {
            pendingGroup = { type: currentType, value: {} };
        }

        // Update pending group values
        switch (func) {
            case 'translate':
                pendingGroup.value.x = parseSizeValue(argsList[0]);
                pendingGroup.value.y = parseSizeValue(argsList[1] || '0px');
                flushPending(); // Always flush generic translate to be safe
                break;
            case 'translateX':
                pendingGroup.value.x = parseSizeValue(args.trim());
                break;
            case 'translateY':
                pendingGroup.value.y = parseSizeValue(args.trim());
                break;
            case 'translate3d':
                pendingGroup.value.x = parseSizeValue(argsList[0]);
                pendingGroup.value.y = parseSizeValue(argsList[1] || '0px');
                break;

            case 'rotate':
                pendingGroup.value.z = parseSizeValue(args.trim());
                break;
            case 'rotateX':
                pendingGroup.value.x = parseSizeValue(args.trim());
                break;
            case 'rotateY':
                pendingGroup.value.y = parseSizeValue(args.trim());
                break;
            case 'rotateZ':
                pendingGroup.value.z = parseSizeValue(args.trim());
                break;

            case 'scale':
                pendingGroup.value.x = createNumberValue(argsList[0]);
                pendingGroup.value.y = createNumberValue(argsList[1] || argsList[0]);
                break;
            case 'scaleX':
                pendingGroup.value.x = createNumberValue(args.trim());
                break;
            case 'scaleY':
                pendingGroup.value.y = createNumberValue(args.trim());
                break;

            case 'skew':
                pendingGroup.value.x = parseSizeValue(argsList[0]);
                pendingGroup.value.y = parseSizeValue(argsList[1] || '0deg');
                break;
            case 'skewX':
                pendingGroup.value.x = parseSizeValue(args.trim());
                break;
            case 'skewY':
                pendingGroup.value.y = parseSizeValue(args.trim());
                break;
        }
    }

    // Flush remaining
    flushPending();

    // Return null if no valid transforms were parsed
    if (functions.length === 0) {
        return null;
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

export const elementorTransformMappers = {
    // Transform
    'transform': (value) => {
        if (!value || value === 'none') {
            return {};
        }
        const transformResult = parseTransform(value);
        if (!transformResult) {
            return {};
        }
        return {
            transform: transformResult
        };
    },

    // Backface Visibility (related to 3D transforms)
    'backface-visibility': (value) => {
        // Not directly mapped but good to have if needed later
        return {};
    },

    // Perspective (related to 3D transforms)
    'perspective': (value) => ({
        perspective: parseSizeValue(value)
    }),

    // Transform Origin
    'transform-origin': (value) => {
        if (!value) return {};
        // Elementor generally expects x y values
        return {
            'transform-origin': {
                $$type: 'string', // Actually usually handled as a string in Elementor v4 JSONs seen
                value: value
            }
        };
    }
};
