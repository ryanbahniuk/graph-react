import { type ElementDefinition } from 'cytoscape';

class GraphNode {
  id: symbol;
  elementId: string;

  constructor({ id }: { id: string }) {
    this.id = Symbol.for(id);
    this.elementId = id;
  }

  toJSON() {
    return JSON.stringify(this.toElement())
  }

  toElement(): ElementDefinition {
    return {
      data: {
        id: this.elementId,
      }
    }
  }
}

export default GraphNode;

