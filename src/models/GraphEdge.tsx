import { type ElementDefinition } from 'cytoscape';

import { type NodeID } from './GraphNode';

export type EdgeID = string;

class GraphEdge {
  id: symbol;
  elementId: EdgeID;
  sourceId: NodeID;
  targetId: NodeID;
  weight: number;

  constructor({ sourceId, targetId, weight }: { sourceId: string, targetId: string, weight: number }) {
    const representation = `GraphEdge:${sourceId}${targetId}`;
    this.id = Symbol.for(representation);
    this.elementId = representation
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.weight = weight;
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
        source: this.sourceId,
        target: this.targetId,
				weight: this.weight,
      }
    }
  }
}

export default GraphEdge;
