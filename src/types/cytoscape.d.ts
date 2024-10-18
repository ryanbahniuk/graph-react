import cytoscape from 'cytoscape';

declare module 'cytoscape' {
	interface Collection {
		markovClustering(options?: MarkovClusteringOptions): cytoscape.Collection[];
	}
}

interface MarkovClusteringOptions {
	expandFactor?: number;
	inflateFactor?: number;
	multFactor?: number;
	maxIterations?: number;
	attributes?: Array<(edge: cytoscape.EdgeSingular) => number>;
}
