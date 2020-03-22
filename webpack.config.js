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
			filename: 'styles/[name].css',
			ignoreOrder: true
		}),
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

function getSassLoaders() {
	var sassLoaders = [];

	// Using MiniCssExtractPlugin to write the extracted css output to its own file.
	sassLoaders.push({
		loader: MiniCssExtractPlugin.loader,
		options: {
			hmr: process.env.NODE_ENV === 'development',
		}
	});

	// Use css-loader without resolving url() links - these point to existing artifacts.
	sassLoaders.push({
		loader: "css-loader",
		options: {
			url: false,
			sourceMap: true
		}
	});

	// Add postcss loader only for production (autoprefixer, css-mqpacker, cssnano),
	// it breaks the sourcemap required for development.
	if (isProd) {
		sassLoaders.push({
			loader: "postcss-loader",
			options: {
				config: {
					path: './postcss.config.js'
				}
			}
		});
	}

	sassLoaders.push({
		loader: "sass-loader",
		options: {
			sourceMap: true
		}
	});

	return sassLoaders;
}

module.exports = {
	context: path.join(__dirname, '.'),
	entry: {
		'pre-optimized-min': [ './sources/index.ts' ],
		'react-components': ['./react-components/src/react-components.ts'],
		'grid': ['./sources/grid/grid.ts']
	},
	devtool: isProd ? undefined : 'cheap-module-inline-source-map',
	output: {
		// Create the output files relative to the current folder, not the default 'dist' folder
		// This configuration is also applicable to MiniCssExtractPlugin
		path: __dirname,
		library: 'vitens',
		libraryTarget: 'umd',
		filename: 'scripts/[name].js'
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
				use: [
					{ 
						loader: 'ts-loader',
						options: {
							// This is to always use the same tsconfig, otherwise the tsconfig from CRA will be picked up
							configFile: 'customTsConfig.json'
						}
					}
				]
			},
			{
				test: /\.s?css$/,
				use: getSassLoaders()
			},
			{
				test: /\.json$/,
				exclude: /node_modules/,
				use: [{ loader: 'json-loader' }]
			}
		]
	},
	resolve: {
		// Allow require('./blah') to require blah.jsx
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	externals: {
		// Use external version of jQuery
		jquery: 'jQuery'
	},
	plugins: getPlugins()
};
