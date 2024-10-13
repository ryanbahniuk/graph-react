const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
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
	externals: {
		react: 'React'
	},
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    hot: true,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
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
