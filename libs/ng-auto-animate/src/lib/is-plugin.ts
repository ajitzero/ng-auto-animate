import { AutoAnimationConfig } from './tokens';

export const isPlugin = (config: AutoAnimationConfig) => typeof config === 'function';
