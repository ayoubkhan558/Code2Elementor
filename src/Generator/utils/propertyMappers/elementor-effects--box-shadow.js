/**
 * Elementor Box Shadow Property Mappers
 */
import { parseSizeValue, createColorValue, createStringValue } from './mapperUtils';

/**
 * Parse box-shadow value
 * CSS format: [inset] h-offset v-offset [blur] [spread] [color]
 * Reference format from Elementor:
 * - hOffset, vOffset, blur, spread are $$type: 'size'
 * - color is $$type: 'color'  
 * - position is null for outset, { $$type: 'string', value: 'inset' } for inset shadows
 */
const parseBoxShadow = (value) => {
    if (!value || value === 'none') {
        return [];
    }

    const shadows = [];

    // Split multiple shadows (comma-separated, but not inside parentheses)
    const shadowParts = value.split(/,(?![^(]*\))/);

    shadowParts.forEach(shadowValue => {
        const trimmed = shadowValue.trim();
        if (!trimmed) return;

        // Check for inset keyword
        const isInset = /\binset\b/i.test(trimmed);
        let cleanValue = trimmed.replace(/\binset\b/gi, '').trim();

        // Extract color first (it can be anywhere)
        let color = 'rgba(0, 0, 0, 1)';

        // Match rgba/rgb first
        const rgbaMatch = cleanValue.match(/rgba?\([^)]+\)/i);
        if (rgbaMatch) {
            color = rgbaMatch[0];
            cleanValue = cleanValue.replace(rgbaMatch[0], '').trim();
        } else {
            // Match hex color
            const hexMatch = cleanValue.match(/#[0-9a-f]{3,8}/i);
            if (hexMatch) {
                color = hexMatch[0];
                cleanValue = cleanValue.replace(hexMatch[0], '').trim();
            }
        }

        // Now extract all size values with ALL CSS units
        const sizePattern = /[+-]?\d*\.?\d+(?:px|em|rem|vh|vw|vmin|vmax|%|pt|cm|mm|in)?/gi;
        const sizeMatches = cleanValue.match(sizePattern) || [];

        // Check if there's a remaining word that could be a named color
        const remaining = cleanValue.replace(sizePattern, '').trim();
        if (remaining && /^[a-z]+$/i.test(remaining)) {
            color = remaining;
        }

        if (sizeMatches.length >= 2) {
            shadows.push({
                $$type: 'shadow',
                value: {
                    hOffset: parseSizeValue(sizeMatches[0] || '0px'),
                    vOffset: parseSizeValue(sizeMatches[1] || '0px'),
                    blur: parseSizeValue(sizeMatches[2] || '0px'),
                    spread: parseSizeValue(sizeMatches[3] || '0px'),
                    color: createColorValue(color),
                    position: isInset ? createStringValue('inset') : null
                }
            });
        }
    });

    return shadows;
};

export const elementorBoxShadowMappers = {
    // Box Shadow - returns empty if no valid shadows
    'box-shadow': (value) => {
        if (!value || value === 'none') {
            return {};
        }
        const shadows = parseBoxShadow(value);
        if (shadows.length === 0) {
            return {};
        }
        return {
            'box-shadow': {
                $$type: 'box-shadow',
                value: shadows
            }
        };
    }
};
