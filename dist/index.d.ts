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
    buildGraphNodeID: (id: string, nodeType?: string) => import("./models/GraphNode").NodeID;
    buildGraphEdgeID: (sourceId: string, targetId: string, edgeType?: string) => import("./models/GraphEdge").EdgeID;
};
export default result;
