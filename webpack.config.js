var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');

// local css modules
loaders.push({
	test: /[\/\\]src[\/\\].*\.css/,
	exclude: /(node_modules|bower_components|dist\/)/,
	loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
});

// local scss modules
loaders.push({
	test: /[\/\\]src[\/\\].*\.scss/,
	exclude: /(node_modules|bower_components|dist\/)/,
	loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass')
});
// global css files
loaders.push({
	test: /[\/\\](node_modules|global)[\/\\].*\.css$/,
	loader: ExtractTextPlugin.extract('style', 'css')
});

const DIST_PATH = path.join(__dirname, 'dist');
const JS_DIST_PATH = path.join(DIST_PATH, 'js');

module.exports = {
	entry: [
		'./src/js/components/Popup.jsx'
	],
	output: {
		publicPath: '/',
		path: DIST_PATH,
		filename: '[chunkhash].js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders
	},
	plugins: [
		new WebpackCleanupPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				drop_console: true,
				drop_debugger: true
			}
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new ExtractTextPlugin('[contenthash].css', {
			allChunks: true
		}),
		new HtmlWebpackPlugin({
			filename: 'popup.html',
			template: './src/popup.html',
			title: 'ThemisUI Explorer'
		}),
		new CopyWebpackPlugin([
			{ from: 'src/icons/icon19.png', to: path.join(DIST_PATH, 'icons') },
			{ from: 'src/icons/icon38.png', to: path.join(DIST_PATH, 'icons') },
			{ from: 'src/icons/icon128.png', to: path.join(DIST_PATH, 'icons') },
			{ from: 'src/js/background.js', to: JS_DIST_PATH },
			{ from: 'src/js/themisui-explorer.js', to: JS_DIST_PATH },
			{ from: 'src/manifest.json', to: DIST_PATH }
		], {}),
		new webpack.optimize.DedupePlugin()
	]
};
