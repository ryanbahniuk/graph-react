import { type ElementDefinition } from 'cytoscape';
declare class GraphNode {
    id: symbol;
    elementId: string;
    constructor({ id }: {
        id: string;
    });
    toJSON(): string;
    toElement(): ElementDefinition;
}
export default GraphNode;
