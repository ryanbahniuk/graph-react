import React, { createContext, type FC, type PropsWithChildren, useState } from 'react';
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

export const GraphContext = createContext<GraphContextType | null>(null);

export const GraphProvider: FC<PropsWithChildren> = ({ children }) => {
	const [nodes, setNodes] = useState<NodeMap>({});
	const [edges, setEdges] = useState<EdgeMap>({});
	const [groups, setGroups] = useState<GroupMap>({});

  const addNode = (node: GraphNode) => {
    setNodes((existing) => {
      const newNodeMap = { ...existing };
      newNodeMap[node.elementId] = node;
      return newNodeMap;
    });
  };

  const addNodes = (nodes: GraphNode[]) => {
    setNodes((existing) => {
      const newNodeMap = { ...existing };
      nodes.forEach((node) => {
        newNodeMap[node.elementId] = node;
      });
      return newNodeMap;
    });
  };

  const groupNodes = (id: string, nodeIds: string[]) => {
    let group = groups[id];
    if (!group) {
      group = new GraphGroup({ id });
    }

    nodeIds.forEach((id) => {
      const node = nodes[id];
      if (node) {
        group.addChild(node);
      }
    });

    setGroups((existing) => {
      const newGroupMap = { ...existing };
      newGroupMap[group.elementId] = group;
      return newGroupMap;
    });
  };

  const addEdge = (edge: GraphEdge) => {
    setEdges((existing) => {
      const newEdgeMap = { ...existing };
      newEdgeMap[edge.elementId] = edge;
      return newEdgeMap;
    });
  };

  const addEdges = (edges: GraphEdge[]) => {
    setEdges((existing) => {
      const newEdgeMap = { ...existing };
      edges.forEach((edge: GraphEdge) => {
        newEdgeMap[edge.elementId] = edge;
      });
      return newEdgeMap;
    });
  };

	return <GraphContext.Provider value={{ nodes, edges, groups, addNode, addEdge, addNodes, addEdges, groupNodes }}>{children}</GraphContext.Provider>;
};
