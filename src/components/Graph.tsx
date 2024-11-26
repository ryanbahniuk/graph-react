import React, { useCallback, useRef, useState, useEffect } from 'react';
import { type CSSProperties } from 'react';
import cytoscape from 'cytoscape';
import {
  type CollectionReturnValue,
	type Core,
	type EventObject,
	type EdgeSingular,
	type NodeSingular,
  type Stylesheet,
  type Css,
} from 'cytoscape';
import cose from 'cytoscape-cose-bilkent';
import { type CoseBilkentLayoutOptions } from 'cytoscape-cose-bilkent';
import GraphNode, { type NodeID } from '../models/GraphNode';
import GraphEdge, { type EdgeID } from '../models/GraphEdge';
import GraphGroup, { type GroupID } from '../models/GraphGroup';
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

const shouldZoom = (elements: CollectionReturnValue) => {
  if (elements.length === 1) {
    return !elements.first().classes().includes('group');
  }

  return true;
}

const coseLayoutOptions = (cy: Core, elementsToLayout: CollectionReturnValue, clusters: string[][]): CoseBilkentLayoutOptions => {
  return {
    ...baseCoseLayoutOptions,
    clusters,
    fit: shouldZoom(elementsToLayout),
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
  elementsToLayout.layout(coseLayoutOptions(cy, elementsToLayout, clusters)).run();
}

const updateGroupNodes = (cy: Core, nodes: Set<GraphNode>, groupNodes: Record<string, string>) => {
  nodes.forEach((graphNode) => {
    const groupId = groupNodes[graphNode.elementId];
    const node = cy.getElementById(graphNode.elementId);

    if (groupId) {
      node.move({ parent: groupId });
    } else {
      node.move({ parent: null });
    }
  });
};

const removeElements = (cy: Core, elementsToRemove: Set<GraphElement>) => {
  cy.nodes().lock();
  const toRemove = cy.collection();
  [...elementsToRemove].forEach((graphEl) => {
    const el = cy.getElementById(graphEl.elementId);
    if (el) {
      toRemove.merge(el);
    }
  });
  cy.remove(toRemove);
	cy.nodes().unlock();
};

const addElements = (cy: Core, newElements: Set<GraphElement>) => {
  cy.nodes().lock();
  const toAdd = [...newElements].map((el) => el.toElement());
  const added = cy.add(toAdd);
  runLayout(added, cy);
	cy.nodes().unlock();
};

const baseStylesheet = [
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
      'shape': 'rectangle',
      'background-opacity': 0.333,
      'background-color': '#fafafa',
      'border-color': '#000',
      'border-width': 2,
    }
  },
  {
    selector: '.group',
    style: {
      'shape': 'rectangle',
      'background-opacity': 0.333,
      'background-color': '#fafafa',
      'border-color': '#000',
      'border-width': 2,
    }
  }
];

const updateStyles = (cy: Core, elementStyles: ElementStyles): void => {
  const cyStyle = cy.style(baseStylesheet);

  elementStyles.forEach((value, key) => {
    cyStyle
      .selector(`#${key}`)
      .style(value);
  });

  cyStyle.update();
};

const buildStylesheet = (elementStyles?: ElementStyles): Stylesheet[] => {
  if (!elementStyles) {
    return baseStylesheet;
  }

  const elementObjs: Stylesheet[] = [];
  elementStyles.forEach((value, key) => {
    elementObjs.push({
      selector: `#${String(key)}`,
      style: value,
    });
  });

  return [
    ...baseStylesheet,
    ...elementObjs,
  ];
}

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

export default function Graph(props: GraphProps): React.ReactElement {
  const {
    //autoGroup,
    elementStyles,
    onNodeLoad,
    onNodeMouseover,
    onNodeMouseout,
    onNodeClick,
    onEdgeClick,
    onEdgeMouseover,
    onEdgeMouseout,
    style,
    nodes: propNodeObj,
    edges: propEdgeObj,
    groups: propGroupObj,
    groupNodes: propGroupNodesObj,
  } = props;

  const ref = useRef<HTMLDivElement | null>(null);
  const [cy, setCy] = useState<Core | null>(null);
  const [nodes, setNodes] = useState<Set<GraphNode>>(() => new Set([]));
  const [edges, setEdges] = useState<Set<GraphEdge>>(() => new Set([]));
  const [groups, setGroups] = useState<Set<GraphGroup>>(() => new Set([]));
  const propNodes = new Set<GraphNode>(Object.values(propNodeObj));
  const propGroups = new Set<GraphGroup>(Object.values(propGroupObj || {}));
  const groupNodes = propGroupNodesObj || {};

  const positiveGroupDiff = useCallback(() => setDifference<GraphGroup>(propGroups, groups), [propGroups, groups]);
  const negativeGroupDiff = useCallback(() => setDifference<GraphGroup>(groups, propGroups), [propGroups, groups]);
  const positiveNodeDiff = useCallback(() => setDifference<GraphNode>(propNodes, nodes), [propNodes, nodes]);
  const negativeNodeDiff = useCallback(() => setDifference<GraphNode>(nodes, propNodes), [propNodes, nodes]);
  const negativeEdgeDiff = useCallback(() => {
    const relevantEdges = Object.values(propEdgeObj).filter((edge: GraphEdge) => {
      return !!propNodeObj[edge.sourceId] && !!propNodeObj[edge.targetId];
    });
    return setDifference<GraphEdge>(edges, new Set<GraphEdge>(relevantEdges));
  }, [propEdgeObj, propNodeObj, edges]);
  const positiveEdgeDiff = useCallback(() => {
    const relevantEdges = Object.values(propEdgeObj).filter((edge: GraphEdge) => {
      return !!propNodeObj[edge.sourceId] && !!propNodeObj[edge.targetId];
    });
    return setDifference<GraphEdge>(new Set<GraphEdge>(relevantEdges), edges);
  }, [propEdgeObj, propNodeObj, edges]);

  useEffect(() => {
    if (cy) {
      let diff = new Set<GraphElement>([]);
      const negativeNDiff = negativeNodeDiff();
      const negativeEDiff = negativeEdgeDiff();
      const negativeGDiff = negativeGroupDiff();

      if (negativeEDiff.size > 0) {
        diff = new Set([...diff, ...negativeEDiff]);
        setEdges(new Set<GraphEdge>([...edges].filter(element => !negativeEDiff.has(element))));
      }

      if (negativeNDiff.size > 0) {
        diff = new Set([...diff, ...negativeNDiff]);
        setNodes(new Set<GraphNode>([...nodes].filter(element => !negativeNDiff.has(element))));
      }

      if (negativeGDiff.size > 0) {
        diff = new Set([...diff, ...negativeGDiff]);
        setGroups(new Set<GraphGroup>([...groups].filter(element => !negativeGDiff.has(element))));
      }

      if (diff.size > 0) {
        removeElements(cy, diff);
      }
    }
  }, [cy, propEdgeObj, propNodeObj, propGroupObj]);

  useEffect(() => {
    if (cy) {
      let diff = new Set<GraphElement>([]);
      const positiveNDiff = positiveNodeDiff();
      const positiveEDiff = positiveEdgeDiff();
      const positiveGDiff = positiveGroupDiff();

      if (positiveEDiff.size > 0) {
        diff = new Set([...diff, ...positiveEDiff]);
        setEdges(new Set([...edges, ...positiveEDiff]));
      }

      if (positiveNDiff.size > 0) {
        diff = new Set([...diff, ...positiveNDiff]);
        setNodes(new Set([...nodes, ...positiveNDiff]));
      }

      if (positiveGDiff.size > 0) {
        diff = new Set([...diff, ...positiveGDiff]);
        setGroups(new Set([...groups, ...positiveGDiff]));
      }

      if (diff.size > 0) {
        addElements(cy, diff);
      }
    }
  }, [cy, propEdgeObj, propNodeObj, propGroupObj]);

  useEffect(() => {
    if (cy) {
      updateGroupNodes(cy, nodes, groupNodes);
    }
  }, [cy, nodes, groupNodes]);

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
        style: buildStylesheet(elementStyles),
      }));
    }
  }, [setCy, ref, cy]);

  useEffect(() => {
    if (cy && elementStyles) {
      updateStyles(cy, elementStyles);
    }
  }, [cy, elementStyles]);

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
