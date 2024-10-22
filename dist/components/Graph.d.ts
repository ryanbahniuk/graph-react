import React from 'react';
import { type CSSProperties } from 'react';
import { type EdgeSingular, type NodeSingular } from 'cytoscape';
interface GraphProps {
    onNodeLoad?: (node: NodeSingular) => void;
    onNodeMouseover?: (node: NodeSingular) => void;
    onNodeMouseout?: (node: NodeSingular) => void;
    onNodeClick?: (node: NodeSingular) => void;
    onEdgeClick?: (edge: EdgeSingular) => void;
    onEdgeMouseover?: (edge: EdgeSingular) => void;
    onEdgeMouseout?: (edge: EdgeSingular) => void;
    style?: CSSProperties;
    autoGroup?: boolean;
}
export default function Graph(props: GraphProps): React.ReactElement;
export {};
