import { type ElementDefinition } from 'cytoscape';
declare class GraphEdge {
    id: symbol;
    elementId: string;
    sourceId: string;
    targetId: string;
    weight: number;
    constructor({ sourceId, targetId, weight }: {
        sourceId: string;
        targetId: string;
        weight: number;
    });
    toJSON(): string;
    toElement(): ElementDefinition;
}
export default GraphEdge;
