import GraphNode from './models/GraphNode';
import GraphEdge from './models/GraphEdge';
import GraphGroup from './models/GraphGroup';
import Graph from './components/Graph';
declare const result: {
    GraphNode: typeof GraphNode;
    GraphEdge: typeof GraphEdge;
    GraphGroup: typeof GraphGroup;
    Graph: typeof Graph;
    nodeHelpers: {
        primaryConnections: (node: import("cytoscape").NodeSingular) => import("cytoscape").NodeSingular[];
        secondaryConnections: (node: import("cytoscape").NodeSingular) => import("cytoscape").NodeSingular[];
    };
};
export default result;
