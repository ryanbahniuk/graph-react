import { type ElementDefinition } from 'cytoscape';
import { type ID } from '../types/ID';
export type GroupID = ID<'Group'>;
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
