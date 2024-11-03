import React, { type FC, type PropsWithChildren } from 'react';
import GraphNode, { type NodeID } from '../models/GraphNode';
import GraphEdge, { type EdgeID } from '../models/GraphEdge';
import GraphGroup, { type GroupID } from '../models/GraphGroup';
export interface NodeMap {
    [key: NodeID]: GraphNode;
}
export interface EdgeMap {
    [key: EdgeID]: GraphEdge;
}
export interface GroupMap {
    [key: GroupID]: GraphGroup;
}
export interface GroupChildrenMap {
    [key: NodeID]: GroupID;
}
export type GraphContextType = {
    nodes: NodeMap;
    edges: EdgeMap;
    groups: GroupMap;
    groupChildren: GroupChildrenMap;
    addNode: (node: GraphNode) => void;
    removeNode: (id: string) => void;
    addEdge: (edge: GraphEdge) => void;
    addNodes: (nodes: GraphNode[]) => void;
    removeNodes: (ids: string[]) => void;
    addEdges: (edges: GraphEdge[]) => void;
    addGroup: (id: string) => void;
    removeGroup: (id: string) => void;
    addNodesToGroup: (id: string, nodeIds: string[]) => void;
    removeNodesFromGroup: (id: string, nodeIds: string[]) => void;
    clear: () => void;
};
export declare const GraphContext: React.Context<GraphContextType | null>;
export declare const GraphProvider: FC<PropsWithChildren>;
