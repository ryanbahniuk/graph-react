const fs = require('fs');
const csv = require('csv-parser');

const inputFilePath = process.argv[2]; // CSV file path from command line argument
const outputFilePath = process.argv[3] || 'output.js'; // Output JS file path

if (!inputFilePath) {
	console.error('Please provide a CSV file path as the first argument.');
	process.exit(1);
}

fs.access(inputFilePath, fs.constants.F_OK, (err) => {
	if (err) {
		console.error(`File not found: ${filePath}`);
		process.exit(1);
	}

	const nodes = new Set([]);
	const edges = [];

	fs.createReadStream(inputFilePath)
		.pipe(csv())
		.on('data', (data) => {
			nodes.add(data['SOURCE_USER_ID'].toString())
			nodes.add(data['TARGET_USER_ID'].toString())
			edges.push({
				sourceId: data['SOURCE_USER_ID'].toString(),
				targetId: data['TARGET_USER_ID'].toString(),
				weight: parseFloat(data['TRANSACTION_AMOUNT']),
			});
		})
		.on('end', () => {
      const jsRows = [];

      nodes.forEach((node) => {
        jsRows.push(`new GraphComponent.GraphNode({ id: '${node}' })`)
      });

      edges.forEach((edge) => {
        jsRows.push(`new GraphComponent.GraphEdge({ sourceId: '${edge['sourceId']}', targetId: '${edge['targetId']}', weight: ${edge['weight']} })`);
      });

			const jsText = 'window.elements = [\n' + jsRows.join(',\n') + '\n];';

			const uniqueStrings = new Map();
			const stringRegex = /(['"`])((?:\\.|[^\\])*?)\1/g;
			const swappedCode = jsText.replace(stringRegex, (match, quote, str) => {
				if (!uniqueStrings.has(str)) {
					uniqueStrings.set(str, `id_${str}`);
				}
				return `${quote}${uniqueStrings.get(str)}${quote}`;
			});

			fs.writeFile(outputFilePath, swappedCode, (err) => {
				if (err) {
					console.error(`Error writing to output file: ${err.message}`);
					process.exit(1);
				}
				console.log(`CSV data has been written to ${outputFilePath}`);
			});
		})
		.on('error', (error) => {
			console.error('Error reading the CSV file:', error.message);
		});
});
