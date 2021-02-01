/* eslint-disable */
// Plugins
const merge = require('webpack-merge');
const Visualizer = require('webpack-visualizer-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// Configs
const baseConfig = require('./webpack.base.config');

const prodConfiguration = env => {
	return merge([
		{
			optimization: {
				minimizer: [new UglifyJsPlugin({
					exclude: /vendors~Asientos.js/,
					sourceMap: true,
					uglifyOptions: {
						output: {
							comments: false
						}
					}
				})],
			},
			plugins: [
				new MiniCssExtractPlugin({
					filename: '[name].css',
					chunkFilename: '[name]-chunk.css',
				}),
				new OptimizeCssAssetsPlugin(),
				new Visualizer({ filename: './statistics.html' })
			],
		},
	]);
}

module.exports = env => {
	return merge(baseConfig(env), prodConfiguration(env));
}