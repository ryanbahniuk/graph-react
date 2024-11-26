import React from 'react';
import { type CSSProperties } from 'react';
import { type EdgeSingular, type NodeSingular, type Css } from 'cytoscape';
import GraphNode, { type NodeID } from '../models/GraphNode';
import GraphEdge, { type EdgeID } from '../models/GraphEdge';
import GraphGroup, { type GroupID } from '../models/GraphGroup';
type ElementStylesKey = NodeID | EdgeID | GroupID;
type ElementStylesValue = Css.Node | Css.Edge;
type ElementStyles = Map<ElementStylesKey, ElementStylesValue>;
interface GraphProps {
    onNodeLoad?: (node: NodeSingular) => void;
    onNodeMouseover?: (node: NodeSingular) => void;
    onNodeMouseout?: (node: NodeSingular) => void;
    onNodeClick?: (node: NodeSingular) => void;
    onEdgeClick?: (edge: EdgeSingular) => void;
    onEdgeMouseover?: (edge: EdgeSingular) => void;
    onEdgeMouseout?: (edge: EdgeSingular) => void;
    style?: CSSProperties;
    elementStyles?: ElementStyles;
    autoGroup?: boolean;
    nodes: Record<string, GraphNode>;
    edges: Record<string, GraphEdge>;
    groups?: Record<string, GraphGroup>;
    groupNodes?: Record<string, string>;
}
export default function Graph(props: GraphProps): React.ReactElement;
export {};
