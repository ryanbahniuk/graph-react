import { type ElementDefinition } from 'cytoscape';
export type NodeID = string;
declare class GraphNode {
    id: symbol;
    elementId: NodeID;
    label: string;
    nodeType: string;
    constructor({ id, label, nodeType }: {
        id: string;
        label?: string;
        nodeType?: string;
    });
    toJSON(): string;
    isNode(): boolean;
    toElement(): ElementDefinition;
}
export default GraphNode;
