import {
	type Core,
} from 'cytoscape';

const averageEdgeCount = (cy: Core): number => {
	const nodes = cy.nodes();

	const totalDegree = nodes.reduce(function(sum, node) {
		return sum + node.degree(false);
	}, 0);

	return totalDegree / nodes.length;
};

export {
  averageEdgeCount,
};
