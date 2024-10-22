import { type ElementDefinition } from 'cytoscape';
import GraphNode from './GraphNode';
declare class GraphGroup {
    id: symbol;
    elementId: string;
    label: string;
    children: Set<GraphNode>;
    constructor({ id, label, children }: {
        id: string;
        label?: string;
        children?: Set<GraphNode>;
    });
    toJSON(): string;
    isNode(): boolean;
    addChild(node: GraphNode): void;
    toElement(): ElementDefinition;
}
export default GraphGroup;
