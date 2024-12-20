import { type ElementDefinition } from 'cytoscape';
import { type ID } from '../types/ID';

export type NodeID = ID<'Node'>;

const defaultNodeType = 'Generic';

export const buildGraphNodeID = (id: string, nodeType?: string): NodeID => {
  const nType = nodeType || defaultNodeType;
  return `GraphNode.${nType}.${id}` as NodeID;
}

class GraphNode {
  id: symbol;
  elementId: NodeID;
  label: string;
  nodeType: string;
  rawId: string;

  constructor({ id, label, nodeType }: { id: string, label?: string, nodeType?: string }) {
    this.nodeType = nodeType || defaultNodeType;
    const representation = buildGraphNodeID(id, nodeType);
    this.id = Symbol.for(representation);
    this.label = label || id;
    this.elementId = representation;
    this.rawId = id;
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
        nodeType: this.nodeType,
      }
    }
  }
}

export default GraphNode;

