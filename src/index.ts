import GraphNode, { buildGraphNodeID } from './models/GraphNode';
import GraphEdge, { buildGraphEdgeID } from './models/GraphEdge';
import GraphGroup from './models/GraphGroup';
import { primaryConnections, secondaryConnections } from './helpers/nodeHelpers';

import Graph from './components/Graph';

const nodeHelpers = {
  primaryConnections,
  secondaryConnections,
};

const result = {
  GraphNode,
  GraphEdge,
  GraphGroup,
  Graph,
  nodeHelpers,
  buildGraphNodeID,
  buildGraphEdgeID,
};

export default result;
