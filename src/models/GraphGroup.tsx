import { type ElementDefinition } from 'cytoscape';
import GraphNode from './GraphNode';

class GraphGroup {
  id: symbol;
  elementId: string;
  label: string;
  children: Set<GraphNode>;

  constructor({ id, label, children }: { id: string, label?: string, children?: Set<GraphNode> }) {
    this.id = Symbol.for(id);
    this.label = label || id;
    this.elementId = id;
    this.children = children || new Set([]);
  }

  toJSON(): string {
    return JSON.stringify(this.toElement())
  }

  isNode(): boolean {
    return false;
  }

  addChild(node: GraphNode): void {
    node.addParent(this.elementId);
    this.children.add(node);
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

