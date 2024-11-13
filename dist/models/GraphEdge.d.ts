import { type ElementDefinition } from 'cytoscape';
import { type ID } from '../types/ID';
import { type NodeID } from './GraphNode';
export type EdgeID = ID<'Edge'>;
declare class GraphEdge {
    id: symbol;
    elementId: EdgeID;
    sourceId: NodeID;
    targetId: NodeID;
    weight: number;
    edgeType: string;
    constructor({ sourceId, targetId, edgeType, weight }: {
        sourceId: string;
        targetId: string;
        edgeType: string;
        weight: number;
    });
    toJSON(): string;
    isNode(): boolean;
    toElement(): ElementDefinition;
}
export default GraphEdge;
