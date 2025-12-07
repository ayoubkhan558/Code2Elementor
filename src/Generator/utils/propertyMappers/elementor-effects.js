/**
 * Elementor Effects Aggregator
 * Combines all effect-related mappers into a single export
 */
import { elementorTransformMappers } from './elementor-effects--transform';
import { elementorBoxShadowMappers } from './elementor-effects--box-shadow';
import { elementorTransitionMappers } from './elementor-effects--transitions';
import { elementorFilterMappers } from './elementor-effects--filter';
import { elementorMiscEffectsMappers } from './elementor-effects--misc';

export const elementorEffectsMappers = {
  ...elementorTransformMappers,
  ...elementorBoxShadowMappers,
  ...elementorTransitionMappers,
  ...elementorFilterMappers,
  ...elementorMiscEffectsMappers
};
