import { type NodeSingular } from 'cytoscape';
declare const primaryConnections: (node: NodeSingular) => NodeSingular[];
declare const secondaryConnections: (node: NodeSingular) => NodeSingular[];
export { primaryConnections, secondaryConnections, };
