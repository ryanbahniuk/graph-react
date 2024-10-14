import {
	type NodeSingular,
} from 'cytoscape';

const primaryConnections = (node: NodeSingular): NodeSingular[] => {
  return node.neighborhood().toArray().filter((el) => el.isNode());
};

const secondaryConnections = (node: NodeSingular): NodeSingular[] => {
  const immediateNeighbors = node.neighborhood();
  const secondaryNeighbors = immediateNeighbors.neighborhood();

  return secondaryNeighbors.difference(immediateNeighbors).difference(node).toArray().filter((el) => el.isNode());
};

export {
  primaryConnections,
  secondaryConnections,
}
