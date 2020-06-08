'use strict';

const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
	output: {
		filename: 'index.min.js',
		library:  'ProductApp'
	},
	
	module: {
		rules: [
			{
				test:    /\.js$/,
				loader:  'babel-loader',
				exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file)
			}, {
				test:   /\.pug$/,
				loader: 'pug-plain-loader'
			}, {
				test:   /\.vue$/,
				loader: 'vue-loader'
			}
		]
	},
	plugins: [
		new VueLoaderPlugin()
	]
};
