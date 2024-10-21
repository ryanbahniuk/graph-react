import { useContext } from 'react';

import {
	GraphContext,
	type GraphContextType,
} from '../components/GraphProvider';

function useGraph(): GraphContextType {
	const context = useContext<GraphContextType | null>(GraphContext);

	if (!context) {
		throw new Error('"useGraph" must be used within a Provider');
	}

	return context;
}

export default useGraph;
