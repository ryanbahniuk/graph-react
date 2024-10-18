import { type ElementDefinition } from 'cytoscape';

class GraphNode {
  id: symbol;
  elementId: string;
  label: string;
  parent: string | undefined;

  constructor({ id, label, parent }: { id: string, label?: string, parent?: string }) {
    this.id = Symbol.for(id);
    this.label = label || id;
    this.elementId = id;
    this.parent = parent;
  }

  toJSON(): string {
    return JSON.stringify(this.toElement())
  }

  isNode(): boolean {
    return true;
  }

  toElement(): ElementDefinition {
    return {
      data: {
        id: this.elementId,
        label: this.label,
        parent: this.parent,
      }
    }
  }
}

export default GraphNode;

