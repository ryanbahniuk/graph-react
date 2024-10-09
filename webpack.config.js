const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
		library: {
			name: 'GraphComponent',
			type: 'umd',
			export: 'default',
		},
    filename: 'graph-react.min.js',
    path: path.resolve(__dirname, 'dist'),
    globalObject: 'this'
  },
  optimization: {
    minimize: true,
  },
};
