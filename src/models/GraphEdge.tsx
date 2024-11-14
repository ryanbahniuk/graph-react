import { type ElementDefinition } from 'cytoscape';

import { type ID } from '../types/ID';
import { type NodeID } from './GraphNode';

export type EdgeID = ID<'Edge'>;

const defaultEdgeType = 'Generic';

export const buildGraphEdgeID = (sourceId: string, targetId: string, edgeType?: string): EdgeID => {
  const eType = edgeType || defaultEdgeType;
  return `GraphEdge.${eType}.${sourceId}${targetId}` as EdgeID;
}

class GraphEdge {
  id: symbol;
  elementId: EdgeID;
  sourceId: NodeID;
  targetId: NodeID;
  weight: number;
  edgeType: string;

  constructor({ sourceId, targetId, edgeType, weight }: { sourceId: string, targetId: string, edgeType?: string, weight: number }) {
    this.edgeType = edgeType || defaultEdgeType;
    const representation = buildGraphEdgeID(sourceId, targetId, edgeType);
    this.id = Symbol.for(representation);
    this.elementId = representation;
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
