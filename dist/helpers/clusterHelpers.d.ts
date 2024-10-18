import { type Core } from 'cytoscape';
declare const buildMarkovClusters: (cy: Core) => string[][];
declare const buildSimpleClusters: (cy: Core, threshold: number) => string[][];
declare const buildTarjanClusters: (cy: Core) => string[][];
export { buildMarkovClusters, buildTarjanClusters, buildSimpleClusters, };
