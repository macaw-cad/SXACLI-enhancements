/*
*  Copyright (c) 2015, Facebook, Inc.
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree. An additional grant
*  of patent rights can be found in the PATENTS file in the same directory.
*/

var webpack = require("webpack");
var path = require('path');

var isProd = (process.env.NODE_ENV === 'production');

// load this plugin to allow the css files to be extracted to it's own file.
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


// See http://jonnyreeves.co.uk/2016/simple-webpack-prod-and-dev-config/
function getPlugins() {
	var plugins = [];

	// define the name of the output file. All css will be loaded into this file.
	plugins.push(
		new MiniCssExtractPlugin({
			filename: 'styles/pre-optimized-min.css',
			ignoreOrder: true
		})
	);

	// Always expose NODE_ENV to webpack, you can now use `process.env.NODE_ENV`
	// inside your code for any environment checks; UglifyJS will automatically
	// drop any unreachable code. I.e. process.env.Node_ENV !== 'production' becomes 
	// 'production' !== 'production' which is compiled by Babel to false
	plugins.push(new webpack.DefinePlugin({
		'process.env': {
			'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		}
	}));

	plugins.push(new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /nl|en-gb/));

	// Conditionally add plugins for Production builds.
	if (isProd) {
		plugins.push(new OptimizeCssAssetsPlugin());
		plugins.push(new UglifyJsPlugin());
		plugins.push(
			new BundleAnalyzerPlugin({
				// Can be `server`, `static` or `disabled`. 
				// In `server` mode analyzer will start HTTP server to show bundle report. 
				// In `static` mode single HTML file with bundle report will be generated. 
				// In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`. 
				analyzerMode: 'disabled',
				// Host that will be used in `server` mode to start HTTP server. 
				analyzerHost: '127.0.0.1',
				// Port that will be used in `server` mode to start HTTP server. 
				analyzerPort: 8888,
				// Path to bundle report file that will be generated in `static` mode. 
				// Relative to bundles output directory. 
				reportFilename: 'report.html',
				// Module sizes to show in report by default. 
				// Should be one of `stat`, `parsed` or `gzip`. 
				// See "Definitions" section for more information. 
				defaultSizes: 'parsed',
				// Automatically open report in default browser 
				openAnalyzer: true,
				// If `true`, Webpack Stats JSON file will be generated in bundles output directory 
				generateStatsFile: true,
				// Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`. 
				// Relative to bundles output directory. 
				statsFilename: 'stats.json',
				// Options for `stats.toJson()` method. 
				// For example you can exclude sources of your modules from stats file with `source: false` option. 
				// See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21 
				statsOptions: null,
				// Log level. Can be 'info', 'warn', 'error' or 'silent'. 
				logLevel: 'info'
			})
		);
	}

	// Conditionally add plugins for Development
	else {
		// ...
	}

	return plugins;
}

module.exports = {
	context: path.join(__dirname, '.'),
	// define the entry points. In our case one for client and one for server side.
	entry: {
		main: [ './sources/index.ts' /*, './sources/index.scss' */ ]
	},
	devtool: isProd ? undefined : 'cheap-module-inline-source-map',
	output: {
		// Create the output files relative to the current folder, not the default 'dist' folder
		// This configuration is also applicable to MiniCssExtractPlugin
		path: __dirname,
		filename: 'scripts/pre-optimized-min.js'
	},
	module: {
		// Loaders are transformations that take the source of a resource file as the parameter and return the new source.
		rules: [
			{
				test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',

					}
				]
			},
			{
				// CSS loader using style-loader, css-loader, postcss-loader.
				// Using MiniCssExtractPlugin to write the output to its own file.
				test: /\.s?css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: process.env.NODE_ENV === 'development',
						}
					},
					{
						loader: "css-loader?url=false"
					},
					{
						loader: "postcss-loader",
						options: {
							config: {
								path: './postcss.config.js'
							}
						}
					},
					{
						loader: "sass-loader?sourceMap"
					},
					{
						loader: "sass-bulk-import-loader"
					}
				]
			},
			{ test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
			{
				// JSON loader using json-loader
				test: /\.json$/,
				use: {
					loader: 'json-loader'
				}
			}
		]
	},
	resolve: {
		// Allow require('./blah') to require blah.jsx
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	externals: {
		// Use external version of jQuery and React
		jquery: 'jQuery',
		react: 'React',
        "react-dom": "ReactDOM"
	},
	plugins: getPlugins()
};
