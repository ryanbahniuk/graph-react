import React, { createContext, type FC, type PropsWithChildren, useState } from 'react';
import GraphNode from '../models/GraphNode';
import GraphEdge from '../models/GraphEdge';

export interface NodeMap {
  [key: string]: GraphNode;
}

export interface EdgeMap {
  [key: string]: GraphEdge;
}

export type GraphContextType = {
	nodes: NodeMap;
	edges: EdgeMap;
  addNode: (node: GraphNode) => void;
  addEdge: (edge: GraphEdge) => void;
  addNodes: (nodes: GraphNode[]) => void;
  addEdges: (edges: GraphEdge[]) => void;
};

export const GraphContext = createContext<GraphContextType | null>(null);

export const GraphProvider: FC<PropsWithChildren> = ({ children }) => {
	const [nodes, setNodes] = useState<NodeMap>({});
	const [edges, setEdges] = useState<EdgeMap>({});

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

	return <GraphContext.Provider value={{ nodes, edges, addNode, addEdge, addNodes, addEdges }}>{children}</GraphContext.Provider>;
};
