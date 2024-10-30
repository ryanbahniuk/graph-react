import { type ElementDefinition } from 'cytoscape';
import { type NodeID } from './GraphNode';
export type EdgeID = string;
declare class GraphEdge {
    id: symbol;
    elementId: EdgeID;
    sourceId: NodeID;
    targetId: NodeID;
    weight: number;
    constructor({ sourceId, targetId, weight }: {
        sourceId: string;
        targetId: string;
        weight: number;
    });
    toJSON(): string;
    isNode(): boolean;
    toElement(): ElementDefinition;
}
export default GraphEdge;
