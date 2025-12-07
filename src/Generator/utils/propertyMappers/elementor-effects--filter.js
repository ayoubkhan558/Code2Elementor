/**
 * Elementor Filter Property Mappers
 */
import { parseSizeValue, createStringValue, createColorValue } from './mapperUtils';

/**
 * Parse filter value
 */
const parseFilter = (value) => {
    const filters = [];

    const filterRegex = /(\w+(?:-\w+)?)\(([^)]+)\)/g;
    let match;

    while ((match = filterRegex.exec(value)) !== null) {
        const [_, func, arg] = match;

        let filterObj = {
            $$type: 'css-filter-func',
            value: {
                func: createStringValue(func),
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
                const shadowParts = arg.match(/([+-]?\d+(?:\.\d+)?[a-z]*)\s+([+-]?\d+(?:\.\d+)?[a-z]*)\s+([+-]?\d+(?:\.\d+)?[a-z]*)?\s*(rgba?\([^)]+\)|#[0-9a-f]{3,8})?/i);
                if (shadowParts) {
                    filterObj.value.args = {
                        $$type: 'drop-shadow',
                        value: {
                            xAxis: parseSizeValue(shadowParts[1] || '0px'),
                            yAxis: parseSizeValue(shadowParts[2] || '0px'),
                            blur: parseSizeValue(shadowParts[3] || '0px'),
                            color: createColorValue(shadowParts[4] || 'rgba(0, 0, 0, 1)')
                        }
                    };
                }
                break;
        }

        filters.push(filterObj);
    }

    return filters;
};

export const elementorFilterMappers = {
    // Filter - returns empty if no valid filters
    'filter': (value) => {
        if (!value || value === 'none') {
            return {};
        }
        const filters = parseFilter(value);
        if (filters.length === 0) {
            return {};
        }
        return {
            filter: {
                $$type: 'filter',
                value: filters
            }
        };
    },

    // Backdrop Filter - not fully supported, skip for now to avoid validation errors
    'backdrop-filter': (value) => {
        // Skip backdrop-filter as it may not be fully supported in Elementor v4
        return {};
    }
};
