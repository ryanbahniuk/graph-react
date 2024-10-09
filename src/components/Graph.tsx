import React from 'react'
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import {
	type Core,
	type EventObject,
	type EdgeSingular,
	type NodeSingular
} from 'cytoscape';
import cola from 'cytoscape-cola';
import GraphNode from '../models/GraphNode';
import GraphEdge from '../models/GraphEdge';
import { setDifference } from '../utilities/set';

type GraphElement = GraphNode | GraphEdge;

const addElements = (cy: Core, newElements: Set<GraphElement>) => {
  cy.nodes().lock();
  const toAdd = [...newElements].map((el) => el.toElement());
  cy.add(toAdd);
  cy.layout({ name: 'cola' }).run();
  cy.nodes().unlock();
};

const stylesheet = [
  {
    selector: 'node',
    style: {
      'background-color': '#0d4029',
      'label': 'data(id)',
      'font-size': '12px',
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 2,
      'line-color': '#ccc',
      'curve-style': 'bezier',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle',
      'arrow-scale': 0.75,
    }
  }
];

interface GraphProps {
  elements: GraphElement[];
  onNodeLoad?: (node: NodeSingular) => void;
  onNodeMouseover?: (node: NodeSingular) => void;
  onNodeMouseout?: (node: NodeSingular) => void;
  onNodeClick?: (node: NodeSingular) => void;
  onEdgeClick?: (edge: EdgeSingular) => void;
  onEdgeMouseover?: (edge: EdgeSingular) => void;
  onEdgeMouseout?: (edge: EdgeSingular) => void;
  style?: CSSProperties;
}

export default function Graph(props: GraphProps): React.ReactElement {
  const {
    elements,
    onNodeLoad,
    onNodeMouseover,
    onNodeMouseout,
    onNodeClick,
    onEdgeClick,
    onEdgeMouseover,
    onEdgeMouseout,
    style,
  } = props;

  const ref = useRef<HTMLDivElement | null>(null);
  const [cy, setCy] = useState<Core | null>(null);
  const currentElementSet = useMemo(() => new Set(elements), [elements]);
  const [elementSet, setElementSet] = useState<Set<GraphElement>>(() => new Set([]));

  useEffect(() => {
    const diff = setDifference(currentElementSet, elementSet);
    if (cy && diff.size > 0) {
      addElements(cy, diff);
      setElementSet(new Set([...elementSet, ...diff]));
    }
  }, [cy, currentElementSet, elementSet]);

  useEffect(() => {
    if (ref.current && !cy) {
      cytoscape.use(cola);
      setCy(cytoscape({
        container: ref.current,
        zoomingEnabled: true,
        userZoomingEnabled: true,
        panningEnabled: true,
        userPanningEnabled: true,
        boxSelectionEnabled: true,
        touchTapThreshold: 8,
        desktopTapThreshold: 4,
        autolock: false,
        autoungrabify: false,
        autounselectify: false,
        style: stylesheet,
      }));
    }
  }, [setCy, ref, cy]);

  useEffect(() => {
    if (cy && onNodeMouseover) {
      cy.on('mouseover', 'node', (evt: EventObject) => {
				const node = evt.target as NodeSingular;
        onNodeMouseover(node);
      });
    }
  }, [cy, onNodeMouseover]);

  useEffect(() => {
    if (cy && onNodeMouseout) {
      cy.on('mouseout', 'node', (evt: EventObject) => {
				const node = evt.target as NodeSingular;
        onNodeMouseout(node);
      });
    }
  }, [cy, onNodeMouseout]);

  useEffect(() => {
    if (cy && onEdgeMouseover) {
      cy.on('mouseover', 'edge', (evt: EventObject) => {
				const edge = evt.target as EdgeSingular;
        onEdgeMouseover(edge);
      });
    }
  }, [cy, onEdgeMouseover]);

  useEffect(() => {
    if (cy && onEdgeMouseout) {
      cy.on('mouseout', 'edge', (evt: EventObject) => {
				const edge = evt.target as EdgeSingular;
        onEdgeMouseout(edge);
      });
    }
  }, [cy, onEdgeMouseout]);

  useEffect(() => {
    if (cy && onEdgeClick) {
      cy.on('mouseup', 'edge', (evt: EventObject) => {
				const edge = evt.target as EdgeSingular;
				onEdgeClick(edge);
			});
    }
  }, [cy, onEdgeClick]);

  useEffect(() => {
    if (cy && onNodeLoad) {
      cy.nodes().forEach((node) => onNodeLoad(node));
    }
  }, [cy, onNodeLoad]);

  useEffect(() => {
    if (cy && onNodeClick) {
      let isDragging: boolean = false;
      cy.on('drag', 'node', () => { isDragging = true });
      cy.on('mouseup', 'node', function(evt: EventObject) {
        if (!isDragging) {
          const node = evt.target as NodeSingular;
          onNodeClick(node);
        }

        isDragging = false;
      });
    }
  }, [cy, onNodeClick]);

  return (
    <div ref={ref} style={style}>
    </div>
  );
}
