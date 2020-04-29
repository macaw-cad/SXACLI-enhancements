var webpack = require("webpack");
var path = require('path');

const customEntryOutputConfigurations = {
	grid_DMP_Bootstrap_4: {
		entry: {
			'pre-optimized-min': ['../Media Library/Feature/DMP/DMP Bootstrap 4/src/grid.ts']
		},
		output: {
			path: path.resolve(__dirname, '../Media Library/Feature/DMP/DMP Bootstrap 4'),
			library: 'grid_DMP_Bootstrap_4',
			libraryTarget: 'umd',
			filename: 'scripts/[name].js'
		}
	},

	theme_DMP: {
		entry: {
			'pre-optimized-min': [ '../Media Library/Themes/DMP/src/index.ts' ]
		},
		output: {
			path: path.resolve(__dirname, '../Media Library/Themes/DMP'),
			library: 'theme_DMP',
			libraryTarget: 'umd',
			filename: 'scripts/[name].js'
		}
	}
};

// load this plugin to allow the css files to be extracted to it's own file.
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// See http://jonnyreeves.co.uk/2016/simple-webpack-prod-and-dev-config/
function getPlugins(isProd, entryOutputName) {
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
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
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
				analyzerMode: 'static',
				// Host that will be used in `server` mode to start HTTP server. 
				analyzerHost: '127.0.0.1',
				// Port that will be used in `server` mode to start HTTP server. 
				analyzerPort: 8888,
				// Path to bundle report file that will be generated in `static` mode. 
				// Relative to bundles output directory. 
				reportFilename: path.resolve(__dirname, `../stats/${entryOutputName}/report.html`),
				// Module sizes to show in report by default. 
				// Should be one of `stat`, `parsed` or `gzip`. 
				// See "Definitions" section for more information. 
				defaultSizes: 'parsed',
				// Automatically open report in default browser 
				openAnalyzer: false,
				// If `true`, Webpack Stats JSON file will be generated in bundles output directory 
				generateStatsFile: true,
				// Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`. 
				// Relative to bundles output directory. 
				statsFilename: path.resolve(__dirname, `../stats/${entryOutputName}/stats.json`),
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

function getSassLoaders(isProd, entryOutputName) {
	var sassLoaders = [];

	// Using MiniCssExtractPlugin to write the extracted css output to its own file.
	sassLoaders.push({
		loader: MiniCssExtractPlugin.loader,
		options: {
			hmr: process.env.NODE_ENV === 'development',
		}
	});

	// Use css-loader without resolving url() links - these point to existing artifacts like fonts.
	sassLoaders.push({
		loader: "css-loader",
		options: {
			url: false,
			sourceMap: isProd? false : true
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
			sourceMap: isProd? false : true
		}
	});

	return sassLoaders;
}

function getConfig(isProd, entryOutputName) {
	return {
		context: path.join(__dirname, '.'),
		devtool: isProd ? undefined : 'inline-cheap-module-source-map',
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
					use: getSassLoaders(isProd, entryOutputName)
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
		plugins: getPlugins(isProd, entryOutputName)
	};
}

module.exports = env => {
	if (env.NODE_ENV !== 'development' && env.NODE_ENV !== 'production') {
        throw new Error(`NODE_ENV must we either 'development' or 'production', but got '${env.NODE_ENV}'.`);
	}
	console.log(`Webpack build for ${env.NODE_ENV}:`);
	
	var isProd = (env.NODE_ENV === 'production');


	let configurations = [];
	for (let [entryOutName, entryOutputConfig] of Object.entries(customEntryOutputConfigurations)) {
		console.log(`- Processing webpack configuration for ${entryOutName}`);
		configurations.push({ ...getConfig(isProd, entryOutName), ...entryOutputConfig });
	}

	return configurations;
}