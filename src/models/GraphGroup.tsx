import { type ElementDefinition } from 'cytoscape';

class GraphGroup {
  id: symbol;
  elementId: string;
  label: string;

  constructor({ id, label }: { id: string, label?: string }) {
    this.id = Symbol.for(id);
    this.label = label || id;
    this.elementId = id;
  }

  toJSON(): string {
    return JSON.stringify(this.toElement())
  }

  toElement(): ElementDefinition {
    return {
      data: {
        id: this.elementId,
        label: this.label,
      }
    }
  }
}

export default GraphGroup;

