import React, { createContext, type FC, type PropsWithChildren, useState } from 'react';
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
};

export const GraphContext = createContext<GraphContextType | null>(null);

export const GraphProvider: FC<PropsWithChildren> = ({ children }) => {
	const [nodes, setNodes] = useState<NodeMap>({});
	const [edges, setEdges] = useState<EdgeMap>({});
	const [groups, setGroups] = useState<GroupMap>({});
	const [groupChildren, setGroupChildren] = useState<GroupChildrenMap>({});

  const addNode = (node: GraphNode) => {
    setNodes((existing) => {
      const newNodeMap = { ...existing };
      newNodeMap[node.elementId] = node;
      return newNodeMap;
    });
  };

  const removeNode = (id: string) => {
    setNodes((existing) => {
      const { [id]: _, ...newNodeMap } = existing;
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

  const removeNodes = (ids: string[]) => {
    setNodes((existing) => {
      const newNodeMap = { ...existing };
      ids.forEach((id) => {
        delete newNodeMap[id];
      });
      return newNodeMap;
    });
  };

  const addGroup = (id: string) => {
    let group = groups[id];
    if (!group) {
      group = new GraphGroup({ id });
    }

    setGroups((existing) => {
      const newGroupMap = { ...existing };
      newGroupMap[group.elementId] = group;
      return newGroupMap;
    });
  };

  const removeGroup = (id: string) => {
    setGroups((existing) => {
      const { [id]: _, ...newGroupMap } = existing;
      return newGroupMap;
    });
  };

  const removeNodesFromGroup = (groupId: string, nodeIds: string[]) => {
    const group = groups[groupId];
    if (!group) {
      return;
    }

    nodeIds.forEach((nodeId) => {
      const node = nodes[nodeId];
      if (node) {
        setGroupChildren((existing) => {
          const newGroupChildrenMap = { ...existing };
          delete newGroupChildrenMap[nodeId];
          return newGroupChildrenMap;
        });
      }
    });
  };

  const addNodesToGroup = (groupId: string, nodeIds: string[]) => {
    const group = groups[groupId];
    if (!group) {
      return;
    }

    nodeIds.forEach((nodeId) => {
      const node = nodes[nodeId];
      if (node) {
        setGroupChildren((existing) => {
          const newGroupChildrenMap = { ...existing };
          newGroupChildrenMap[nodeId] = groupId;
          return newGroupChildrenMap;
        });
      }
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

  const value = {
    nodes,
    edges,
    groups,
    groupChildren,
    addNode,
    removeNode,
    addEdge,
    addNodes,
    removeNodes,
    addEdges,
    addGroup,
    removeGroup,
    addNodesToGroup,
    removeNodesFromGroup
  };

	return <GraphContext.Provider value={value}>{children}</GraphContext.Provider>;
};
