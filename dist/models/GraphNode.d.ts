import { type ElementDefinition } from 'cytoscape';
declare class GraphNode {
    id: symbol;
    elementId: string;
    label: string;
    parent: string | undefined;
    constructor({ id, label, parent }: {
        id: string;
        label?: string;
        parent?: string;
    });
    toJSON(): string;
    isNode(): boolean;
    addParent(id: string): void;
    removeParent(): void;
    toElement(): ElementDefinition;
}
export default GraphNode;
