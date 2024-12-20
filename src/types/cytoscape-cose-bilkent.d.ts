declare module 'cytoscape-cose-bilkent' {
	import cytoscape from 'cytoscape';

  type TransitionTimingFunction = 
      | "ease"
      | "ease-in"
      | "ease-out"
      | "ease-in-out"
      | "linear"
      | "step-start"
      | "step-end"

  export interface CoseBilkentLayoutOptions {
    name: 'cose-bilkent';
    clusters?: string[][];
    refresh?: number;
    randomize?: boolean;
    componentSpacing?: number;
    nodeRepulsion?: number;
    nodeOverlap?: number;
    idealEdgeLength?: number;
    edgeElasticity?: number;
    initialEnergyOnIncremental?: number;
    nestingFactor?: number;
    gravity?: number;
    gravityRange?: number;
    numIter?: number;
    initialTemp?: number;
    coolingFactor?: number;
    fit?: boolean;
    minTemp?: number;
    animationThreshold?: number;
    animationDuration?: number;
    animationEasing?: TransitionTimingFunction;
    animate?: 'during' | 'end' | false;
  }

	function cose(cytoscape: typeof import('cytoscape')): void;

	export default cose;
}
