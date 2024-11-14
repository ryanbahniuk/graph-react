import GraphNode, { buildGraphNodeID } from './models/GraphNode';
import GraphEdge, { buildGraphEdgeID } from './models/GraphEdge';
import GraphGroup from './models/GraphGroup';
import { primaryConnections, secondaryConnections } from './helpers/nodeHelpers';

import Graph from './components/Graph';
import { GraphProvider } from './components/GraphProvider';

import useGraph from './hooks/useGraph';

const nodeHelpers = {
  primaryConnections,
  secondaryConnections,
};

const result = {
  GraphNode,
  GraphEdge,
  GraphGroup,
  Graph,
  GraphProvider,
  useGraph,
  nodeHelpers,
  buildGraphNodeID,
  buildGraphEdgeID,
};

export default result;
