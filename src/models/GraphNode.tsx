import { type ElementDefinition } from 'cytoscape';

export type NodeID = string;

class GraphNode {
  id: symbol;
  elementId: NodeID;
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
    return true;
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

export default GraphNode;

