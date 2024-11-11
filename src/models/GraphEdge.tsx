import { type ElementDefinition } from 'cytoscape';

import { type ID } from '../types/ID';
import { type NodeID } from './GraphNode';

export type EdgeID = ID<'Edge'>;

class GraphEdge {
  id: symbol;
  elementId: EdgeID;
  sourceId: NodeID;
  targetId: NodeID;
  weight: number;

  constructor({ sourceId, targetId, weight }: { sourceId: string, targetId: string, weight: number }) {
    const representation = `GraphEdge:${sourceId}${targetId}`;
    this.id = Symbol.for(representation);
    this.elementId = representation as EdgeID;
    this.sourceId = sourceId as NodeID;
    this.targetId = targetId as NodeID;
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
