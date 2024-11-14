import GraphNode from './models/GraphNode';
import GraphEdge from './models/GraphEdge';
import GraphGroup from './models/GraphGroup';
import Graph from './components/Graph';
import useGraph from './hooks/useGraph';
declare const result: {
    GraphNode: typeof GraphNode;
    GraphEdge: typeof GraphEdge;
    GraphGroup: typeof GraphGroup;
    Graph: typeof Graph;
    GraphProvider: import("react").FC<{
        children?: import("react").ReactNode | undefined;
    }>;
    useGraph: typeof useGraph;
    nodeHelpers: {
        primaryConnections: (node: import("cytoscape").NodeSingular) => import("cytoscape").NodeSingular[];
        secondaryConnections: (node: import("cytoscape").NodeSingular) => import("cytoscape").NodeSingular[];
    };
    buildGraphNodeID: (id: string, nodeType?: string) => string;
    buildGraphEdgeID: (sourceId: string, targetId: string, edgeType?: string) => string;
};
export default result;
