import { type ElementDefinition } from 'cytoscape';

import { type ID } from '../types/ID';

export type GroupID = ID<'Group'>;

class GraphGroup {
  id: symbol;
  elementId: GroupID;
  label: string;

  constructor({ id, label }: { id: string, label?: string }) {
    this.id = Symbol.for(id);
    this.label = label || id;
    this.elementId = id as GroupID;
  }

  toJSON(): string {
    return JSON.stringify(this.toElement())
  }

  isNode(): boolean {
    return false;
  }

  toElement(): ElementDefinition {
    return {
      data: {
        id: this.elementId,
        label: this.label,
      },
      classes: 'group',
    }
  }
}

export default GraphGroup;

