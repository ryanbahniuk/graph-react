declare module 'cytoscape-cose-bilkent' {
	import cytoscape from 'cytoscape';

	interface CoseOptions {
		name?: string;
	}

	function cost(cytoscape: typeof import('cytoscape')): void;

	export default cost;
}
