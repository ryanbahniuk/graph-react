import { type ElementDefinition } from 'cytoscape';
export type GroupID = string;
declare class GraphGroup {
    id: symbol;
    elementId: GroupID;
    label: string;
    constructor({ id, label }: {
        id: string;
        label?: string;
    });
    toJSON(): string;
    isNode(): boolean;
    toElement(): ElementDefinition;
}
export default GraphGroup;
