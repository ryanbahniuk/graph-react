import React, { createContext, type FC, type PropsWithChildren, useState, useCallback } from 'react';
import GraphNode, { type NodeID } from '../models/GraphNode';
import GraphEdge, { type EdgeID } from '../models/GraphEdge';
import GraphGroup, { type GroupID } from '../models/GraphGroup';


export type NodeMap = Map<NodeID, GraphNode>;
export type EdgeMap = Map<EdgeID, GraphEdge>;
export type GroupMap = Map<GroupID, GraphGroup>;
export type GroupChildrenMap = Map<NodeID, GroupID>;

export type GraphContextType = {
	nodes: NodeMap;
	edges: EdgeMap;
	groups: GroupMap;
  groupChildren: GroupChildrenMap;
  addNode: (node: GraphNode) => void;
  removeNode: (id: NodeID) => void;
  addEdge: (edge: GraphEdge) => void;
  addNodes: (nodes: GraphNode[]) => void;
  removeNodes: (ids: NodeID[]) => void;
  addEdges: (edges: GraphEdge[]) => void;
  addGroup: (id: GroupID) => void;
  removeGroup: (id: GroupID) => void;
  addNodesToGroup: (id: GroupID, nodeIds: NodeID[]) => void;
  removeNodesFromGroup: (id: GroupID, nodeIds: NodeID[]) => void;
  clear: () => void;
};

export const GraphContext = createContext<GraphContextType | null>(null);

export const GraphProvider: FC<PropsWithChildren> = ({ children }) => {
	const [nodes, setNodes] = useState<NodeMap>(new Map);
	const [edges, setEdges] = useState<EdgeMap>(new Map);
	const [groups, setGroups] = useState<GroupMap>(new Map);
	const [groupChildren, setGroupChildren] = useState<GroupChildrenMap>(new Map);

  const clear = () => {
    setNodes(new Map);
    setEdges(new Map);
    setGroups(new Map);
    setGroupChildren(new Map);
  }

  const addNode = (node: GraphNode) => {
    setNodes((existing) => {
      const newNodeMap = new Map(existing);
      newNodeMap.set(node.elementId, node);
      return newNodeMap;
    });
  };

  const removeNode = (id: NodeID) => {
    setNodes((existing) => {
      const newNodeMap = new Map(existing);
      newNodeMap.delete(id);
      return newNodeMap;
    });
  };

  const addNodes = (nodes: GraphNode[]) => {
    setNodes((existing) => {
      const newNodeMap = new Map(existing);
      nodes.forEach((node) => {
        newNodeMap.set(node.elementId, node);
      });
      return newNodeMap;
    });
  };

  const removeNodes = (ids: NodeID[]) => {
    setNodes((existing) => {
      const newNodeMap = new Map(existing);
      ids.forEach((id) => {
        newNodeMap.delete(id);
      });
      return newNodeMap;
    });
  };

  const addGroup = (id: GroupID) => {
    setGroups((existing) => {
      if (existing.has(id)) {
        return existing;
      }

      const newGroupMap = new Map(existing);
      const newGroup = new GraphGroup({ id });
      newGroupMap.set(newGroup.elementId, newGroup);
      return newGroupMap;
    });
  };

  const removeGroup = (id: GroupID) => {
    setGroups((existing) => {
      const newGroupMap = new Map(existing);
      newGroupMap.delete(id);
      return newGroupMap;
    });
  };

  const removeNodesFromGroup = useCallback((groupId: GroupID, nodeIds: NodeID[]) => {
    if (!groups.has(groupId)) {
      return;
    }

    nodeIds.forEach((nodeId) => {
      const node = nodes.get(nodeId);
      if (node) {
        setGroupChildren((existing) => {
          const newGroupChildrenMap = new Map(existing);
          newGroupChildrenMap.delete(nodeId);
          return newGroupChildrenMap;
        });
      }
    });
  }, [groups, nodes]);

  const addNodesToGroup = useCallback((groupId: GroupID, nodeIds: NodeID[]) => {
    if (!groups.has(groupId)) {
      return;
    }

    nodeIds.forEach((nodeId) => {
      const node = nodes.get(nodeId);
      if (node) {
        setGroupChildren((existing) => {
          const newGroupChildrenMap = new Map(existing);
          newGroupChildrenMap.set(nodeId, groupId);
          return newGroupChildrenMap;
        });
      }
    });
  }, [groups, nodes]);

  const addEdge = (edge: GraphEdge) => {
    setEdges((existing) => {
      const newEdgeMap = new Map(existing);
      newEdgeMap.set(edge.elementId, edge);
      return newEdgeMap;
    });
  };

  const addEdges = (edges: GraphEdge[]) => {
    setEdges((existing) => {
      const newEdgeMap = new Map(existing);
      edges.forEach((edge: GraphEdge) => {
        newEdgeMap.set(edge.elementId, edge);
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
    removeNodesFromGroup,
    clear,
  };

	return <GraphContext.Provider value={value}>{children}</GraphContext.Provider>;
};
