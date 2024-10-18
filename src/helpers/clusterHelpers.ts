import {
	type Core,
	type EdgeSingular,
  type NodeSingular,
  type NodeCollection,
} from 'cytoscape';

const buildMarkovClusters = (cy: Core): string[][] => {
  const arrayOfClusterArrays: string[][] = [];

  // @ts-ignore
	const markovClusters = cy.elements().markovClustering({
		expandFactor: 2,
		inflateFactor: 2,
		multFactor: 1,
		maxIterations: 10,
		attributes: [
			(edge: EdgeSingular) => {
				return edge.data('weight') as number;
			},
		]
	});

  for (let i = 0; i < markovClusters.length; i++) {
    for (let j = 0; j < markovClusters[i].length; j++) {
      const node = markovClusters[i][j];
      node.data('clusterID', i);
      arrayOfClusterArrays[i] ||= [];
      arrayOfClusterArrays[i].push(node.id());
    }
  }

  return arrayOfClusterArrays.sort((a, b) => b.length - a.length);
}

const buildSimpleClusters = (cy: Core, threshold: number): string[][] => {
  const nodes = cy.nodes();
  const clusters: string[][] = [];
  const visitedNodes = new Set<string>();

  nodes.forEach(node => {
    if (!visitedNodes.has(node.id())) {
      const connections = node.outgoers().nodes().length;
      if (connections >= threshold) {
        const cluster = getCluster(node, visitedNodes);
        clusters.push(cluster);
      }
    }
  });

  nodes.forEach(node => {
    if (!visitedNodes.has(node.id())) {
      clusters.push([node.id()]);
      visitedNodes.add(node.id());
    }
  });

  return clusters;
}

const getCluster = (centerNode: NodeSingular, visitedNodes: Set<string>): string[] => {
  const cluster: string[] = [centerNode.id()];
  visitedNodes.add(centerNode.id());

  const neighborhood = centerNode.neighborhood().nodes();
  neighborhood.forEach(neighbor => {
    if (!visitedNodes.has(neighbor.id())) {
      cluster.push(neighbor.id());
      visitedNodes.add(neighbor.id());
    }
  });

  return cluster;
}

const buildTarjanClusters = (cy: Core): string[][] => {
  const nodes = cy.nodes();
  const index = new Map<string, number>();
  const lowLink = new Map<string, number>();
  const onStack = new Map<string, boolean>();
  const stack: string[] = [];
  let indexCounter = 0;
  const components: string[][] = [];

  const strongConnect = (node: NodeSingular): void => {
    const nodeId = node.data('id') as string;
    index.set(nodeId, indexCounter);
    lowLink.set(nodeId, indexCounter);
    indexCounter++;
    stack.push(nodeId);
    onStack.set(nodeId, true);

    const successors: NodeCollection = node.outgoers().nodes();
    for (const successor of successors) {
      const successorId = successor.data('id') as string;
      if (!index.has(successorId)) {
        strongConnect(successor);
        const nodeLowLink = lowLink.get(nodeId);
        const successorLowLink = lowLink.get(successorId);
        if (nodeLowLink && successorLowLink) {
          lowLink.set(nodeId, Math.min(nodeLowLink, successorLowLink));
        }
      } else if (onStack.get(successorId)) {
        const nodeLowLink = lowLink.get(nodeId);
        const successorLowLink = lowLink.get(successorId);
        if (nodeLowLink && successorLowLink) {
          lowLink.set(nodeId, Math.min(nodeLowLink, successorLowLink));
        }
      }
    }

    if (lowLink.get(nodeId) === index.get(nodeId)) {
      const component = [];
      let w: string | undefined;
      do {
        w = stack.pop();
        if (w) {
          onStack.set(w, false);
          component.push(w);
        }
      } while (w !== nodeId);
      components.push(component);
    }
  }

  for (const node of nodes) {
    if (!index.has(node.id())) {
      strongConnect(node);
    }
  }

  return components;
}

export {
  buildMarkovClusters,
	buildTarjanClusters,
  buildSimpleClusters,
};
