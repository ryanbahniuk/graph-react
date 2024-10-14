import { type ElementDefinition } from 'cytoscape';
declare class GraphGroup {
    id: symbol;
    elementId: string;
    label: string;
    constructor({ id, label }: {
        id: string;
        label?: string;
    });
    toJSON(): string;
    toElement(): ElementDefinition;
}
export default GraphGroup;
