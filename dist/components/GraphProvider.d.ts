import React, { type FC, type PropsWithChildren } from 'react';
import GraphNode from '../models/GraphNode';
import GraphEdge from '../models/GraphEdge';
import GraphGroup from '../models/GraphGroup';
export interface NodeMap {
    [key: string]: GraphNode;
}
export interface EdgeMap {
    [key: string]: GraphEdge;
}
export interface GroupMap {
    [key: string]: GraphGroup;
}
export type GraphContextType = {
    nodes: NodeMap;
    edges: EdgeMap;
    groups: GroupMap;
    addNode: (node: GraphNode) => void;
    addEdge: (edge: GraphEdge) => void;
    addNodes: (nodes: GraphNode[]) => void;
    addEdges: (edges: GraphEdge[]) => void;
    groupNodes: (id: string, nodeIds: string[]) => void;
};
export declare const GraphContext: React.Context<GraphContextType | null>;
export declare const GraphProvider: FC<PropsWithChildren>;
