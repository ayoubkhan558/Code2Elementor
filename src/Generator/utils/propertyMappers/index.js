// Main export for all property mappers
import { elementorSizingMappers } from './elementor-sizing';
import { elementorLayoutMappers } from './elementor-layout';
import { elementorPositionMappers } from './elementor-position';
import { elementorBorderMappers } from './elementor-border';
import { elementorTypographyMappers } from './elementor-typography';
import { elementorBackgroundMappers } from './elementor-background';
import { elementorEffectsMappers } from './elementor-effects';

export const CSS_PROP_MAPPERS = {
  ...elementorSizingMappers,
  ...elementorLayoutMappers,
  ...elementorPositionMappers,
  ...elementorBorderMappers,
  ...elementorTypographyMappers,
  ...elementorBackgroundMappers,
  ...elementorEffectsMappers
};
