import { type ElementDefinition } from 'cytoscape';

export type GroupID = string;

class GraphGroup {
  id: symbol;
  elementId: GroupID;
  label: string;

  constructor({ id, label }: { id: string, label?: string }) {
    this.id = Symbol.for(id);
    this.label = label || id;
    this.elementId = id;
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

