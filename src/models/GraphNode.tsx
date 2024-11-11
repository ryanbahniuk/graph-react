import { type ElementDefinition } from 'cytoscape';
import { type ID } from '../types/ID';

export type NodeID = ID<'Node'>;

class GraphNode {
  id: symbol;
  elementId: NodeID;
  label: string;
  nodeType: string;

  constructor({ id, label, nodeType }: { id: string, label?: string, nodeType?: string }) {
    this.id = Symbol.for(id);
    this.label = label || id;
    this.elementId = id as NodeID;
    this.nodeType = nodeType || 'Generic';
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

