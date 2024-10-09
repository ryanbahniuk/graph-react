declare module 'cytoscape-cola' {
	import cytoscape from 'cytoscape';

	interface ColaOptions {
		name?: string;
	}

	function cola(cytoscape: typeof import('cytoscape')): void;

	export default cola;
}
