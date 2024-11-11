import { type ElementDefinition } from 'cytoscape';
import { type ID } from '../types/ID';
export type NodeID = ID<'Node'>;
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
