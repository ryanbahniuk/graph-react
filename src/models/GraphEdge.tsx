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
  edgeType: string;

  constructor({ sourceId, targetId, edgeType, weight }: { sourceId: string, targetId: string, edgeType: string, weight: number }) {
    this.edgeType = edgeType || 'Generic';
    const representation = `GraphEdge:${this.edgeType}:${sourceId}${targetId}`;
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
        edgetype: this.edgeType,
      }
    }
  }
}

export default GraphEdge;
