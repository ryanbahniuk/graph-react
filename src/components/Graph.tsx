import React, { useCallback, useRef, useState, useEffect } from 'react';
import { type CSSProperties } from 'react';
import cytoscape from 'cytoscape';
import {
  type CollectionReturnValue,
	type Core,
	type EventObject,
	type EdgeSingular,
	type NodeSingular,
} from 'cytoscape';
import cose from 'cytoscape-cose-bilkent';
import { type CoseBilkentLayoutOptions } from 'cytoscape-cose-bilkent';
import GraphNode from '../models/GraphNode';
import GraphEdge from '../models/GraphEdge';
import GraphGroup from '../models/GraphGroup';
import useGraph from '../hooks/useGraph';
import { averageEdgeCount } from '../helpers/graphHelpers';
import { buildSimpleClusters } from '../helpers/clusterHelpers';
import { setDifference } from '../utilities/set';

type GraphElement = GraphNode | GraphEdge | GraphGroup;

const baseCoseLayoutOptions: CoseBilkentLayoutOptions = {
	name: 'cose-bilkent',
  nestingFactor: 0.1,
  gravity: 0.2,
	gravityRange: 0.38,
  numIter: 5000,
  randomize: true,
  initialEnergyOnIncremental: 0.3,
  animate: 'end',
  animationDuration: 1000,
  animationEasing: 'ease-in-out',
};

const baseNodeRepulsion = 15000;
const baseIdealEdgeLength = 150;
const baseEdgeElasticity = 100;

const coseLayoutOptions = (cy: Core, clusters: string[][]): CoseBilkentLayoutOptions => {
  return {
    ...baseCoseLayoutOptions,
    clusters,
    nodeRepulsion: baseNodeRepulsion * clusters.length,
    idealEdgeLength: baseIdealEdgeLength * 1.5,
    edgeElasticity: baseEdgeElasticity * 0.5,
  };
};

const runLayout = (collection: CollectionReturnValue, cy: Core, autoGroup?: boolean) => {
  const average = averageEdgeCount(cy);
  const clusters = buildSimpleClusters(cy, average);

  if (autoGroup) {
    const relevantClusters = clusters.filter((clusterArr: string[]) => clusterArr.length > average);
    const groups: GraphGroup[] = relevantClusters.map((_arr, index) => new GraphGroup({ id: `autogroup_${index}` }),);
    cy.add(groups.map((g) => g.toElement()));
    relevantClusters.forEach((clusterArr: string[], index: number) => {
      clusterArr.forEach((id: string) => {
        const node = cy.getElementById(id);
        const groupId = groups[index].elementId;
        node.move({ parent: groupId });
      });
    });
  }

  const elementsToLayout = collection.union(collection.connectedNodes());
  elementsToLayout.layout(coseLayoutOptions(cy, clusters)).run();
}

const updateNodes = (cy: Core, groups: Set<GraphGroup>) => {
  groups.forEach((group) => {
    group.children.forEach((graphNode) => {
      const node = cy.getElementById(graphNode.elementId);
      node.move({ parent: group.elementId });
    });
  });
};

const addElements = (cy: Core, newElements: Set<GraphElement>) => {
  cy.nodes().lock();
  const toAdd = [...newElements].map((el) => el.toElement());
  const added = cy.add(toAdd);
  runLayout(added, cy);
	cy.nodes().unlock();
};

const stylesheet = [
  {
    selector: 'node',
    style: {
      'background-color': '#0d4029',
      'label': 'data(label)',
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
  },
  {
    selector: ':parent',
    style: {
      'background-opacity': 0.333,
      'background-color': '#fafafa',
      'border-color': '#2B65EC',
      'border-width': 2
    }
  }
];

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

export default function Graph(props: GraphProps): React.ReactElement {
  const {
    //autoGroup,
    onNodeLoad,
    onNodeMouseover,
    onNodeMouseout,
    onNodeClick,
    onEdgeClick,
    onEdgeMouseover,
    onEdgeMouseout,
    style,
  } = props;

  const {
    nodes: graphContextNodes,
    edges: graphContextEdges,
    groups: graphContextGroups,
  } = useGraph();
  const ref = useRef<HTMLDivElement | null>(null);
  const [cy, setCy] = useState<Core | null>(null);
  const [nodes, setNodes] = useState<Set<GraphNode>>(() => new Set([]));
  const [edges, setEdges] = useState<Set<GraphEdge>>(() => new Set([]));
  const [groups, setGroups] = useState<Set<GraphGroup>>(() => new Set([]));

  const groupDiff = useCallback(() => {
    const contextGroups = new Set(Object.values(graphContextGroups));
    return setDifference(contextGroups, groups);
  }, [graphContextGroups, groups]);

  const nodeDiff = useCallback(() => {
    const contextNodes = new Set(Object.values(graphContextNodes));
    return setDifference(contextNodes, nodes);
  }, [graphContextNodes, nodes]);

  const edgeDiff = useCallback(() => {
    const relevantEdges = Object.values(graphContextEdges).filter((edge) => {
      return graphContextNodes[edge.sourceId] && graphContextNodes[edge.targetId]
    });
    return setDifference(new Set(relevantEdges), edges);
  }, [graphContextEdges, graphContextNodes, edges]);

  useEffect(() => {
    if (cy) {
      let diff = new Set<GraphElement>([]);
      const nDiff = nodeDiff();
      const eDiff = edgeDiff();

      if (eDiff.size > 0) {
        diff = new Set([...diff, ...eDiff]);
        setEdges(new Set([...edges, ...eDiff]));
      }

      if (nDiff.size > 0) {
        diff = new Set([...diff, ...nDiff]);
        setNodes(new Set([...nodes, ...nDiff]));
      }

      addElements(cy, diff);
    }
  }, [cy, graphContextEdges, graphContextNodes]);

  useEffect(() => {
    if (cy) {
      const diff = groupDiff();
      const newGroups = new Set([...groups, ...diff]);

      setGroups(newGroups);
      addElements(cy, diff);
      updateNodes(cy, newGroups);
    }
  }, [cy, graphContextGroups]);

  useEffect(() => {
    if (ref.current && !cy) {
      cytoscape.use(cose);
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
