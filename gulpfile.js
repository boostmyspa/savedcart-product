'use strict';

const {src, dest, lastRun, parallel, series, watch} = require('gulp');

const browserSync = require('browser-sync').create();
const del         = require('del');

const cssnanoPlugin = require('gulp-cssnano');
const htmlMinPlugin = require('gulp-htmlmin');
const lessPlugin    = require('gulp-less');
const microPlugin   = require('gulp-micro');
const postcssPlugin = require('gulp-postcss');
const pugPlugin     = require('gulp-pug');
const renamePlugin  = require('gulp-rename');
const sizePlugin    = require('gulp-size');

const autoprefixer        = require('autoprefixer');
const LessPluginNpmImport = require('less-plugin-npm-import');

const webpackPlugin = require('webpack-stream');

function isProduction() {
	return process.env.NODE_ENV === 'production';
}

const PATHS = new function() {
	this.srcDir  = 'src';
	this.distDir = 'dist';
	
	// Files to be copied to `distDir`
	this.files = [
		// `${this.srcDir}/folder/**` // Copy whole folder with subfolders
		// `${this.srcDir}/file`      // Copy specified file
	];
	
	this.cssDir   = `${this.srcDir}/css`;
	this.cssFiles = `${this.cssDir}/**/*.css`;
	
	this.fontsOut = `${this.distDir}/fonts`;
	
	this.htmlDir   = `${this.srcDir}/html`;
	this.htmlFiles = `${this.htmlDir}/**/*.html`;
	this.htmlOut   = this.distDir;
	
	this.imgDir   = `${this.srcDir}/img`;
	this.imgFiles = `${this.imgDir}/**`;
	this.imgOut   = `${this.distDir}/img`;
	
	this.jsDir   = `${this.srcDir}/js`;
	this.vueDir  = `${this.srcDir}/vue`;
	this.jsFiles = [
		`${this.jsDir}/**/*.js`,
		`${this.vueDir}/**/*.vue`
	];
	this.jsIn    = `${this.vueDir}/index.vue`;
	this.jsOut   = `${this.distDir}/js`;
	
	this.lessDir   = `${this.srcDir}/less`;
	this.lessFiles = `${this.lessDir}/**/*.less`;
	this.lessIn    = `${this.lessDir}/index.less`;
	this.lessOut   = `${this.distDir}/css`;
	
	this.pugDir   = `${this.srcDir}/pug`;
	this.pugFiles = `${this.pugDir}/**`;
	this.pugIn    = [
		`${this.pugDir}/**/*.pug`,
		`!${this.pugDir}/includes/**`
	];
	this.pugOut   = this.distDir;
};

// Files

const files = parallel(filesCopy);

function filesCopy() {
	if (!PATHS.files.length) return Promise.resolve();
	
	return src(PATHS.files)
		.pipe(sizePlugin({title: 'Files', showTotal: true}))
		.pipe(dest(PATHS.distDir));
}

// Images

function images() {
	return src(PATHS.imgFiles)
		.pipe(microPlugin({limit: 2 ** 19}))
		.pipe(sizePlugin({title: 'Images', showTotal: true}))
		.pipe(dest(PATHS.imgOut));
}

// Markup

const markup = parallel(html, pug);

function html() {
	return src(PATHS.htmlFiles, {since: lastRun(html)})
		.pipe(sizePlugin({title: 'HTML', showTotal: true}))
		.pipe(htmlMinPlugin({
			collapseBooleanAttributes: true,
			collapseWhitespace:        true,
			conservativeCollapse:      true,
			removeComments:            true
		}))
		.pipe(sizePlugin({title: 'HTML minified', showTotal: true}))
		.pipe(dest(PATHS.htmlOut));
}
function pug() {
	return src(PATHS.pugIn)
		.pipe(pugPlugin())
		.pipe(sizePlugin({title: 'Pug', showTotal: true}))
		.pipe(dest(PATHS.pugOut));
}

// Scripts

const scripts = parallel(jsWebpack);

function jsWebpack() {
	return src(PATHS.jsIn)
		.pipe(webpackPlugin(
			{
				...require('./webpack.config'),
				mode: isProduction() ? 'production' : 'development',
				devtool: isProduction() ? false : 'source-map'
			}))
		.pipe(sizePlugin({title: 'JS bundled', showFiles: true, showTotal: false}))
		.pipe(dest(PATHS.jsOut));
}

// Styles

const styles = parallel(less);

function less() {
	return src(PATHS.lessIn, {sourcemaps: !isProduction()})
		.pipe(lessPlugin({
			plugins: [new LessPluginNpmImport({prefix: '~'})]
		}))
		.pipe(sizePlugin({title: 'CSS', showFiles: true, showTotal: false}))
		.pipe(postcssPlugin([autoprefixer()]))
		.pipe(sizePlugin({title: 'CSS w/ prefixes', showFiles: true, showTotal: false}))
		.pipe(cssnanoPlugin())
		.pipe(renamePlugin({suffix: '.min'}))
		.pipe(sizePlugin({title: 'CSS minified', showFiles: true, showTotal: false}))
		.pipe(dest(PATHS.lessOut, {sourcemaps: isProduction() ? false : '.'}));
}

// Stages

function clean() {
	return del(PATHS.distDir);
}

const build = series(clean, parallel(files, images, markup, scripts, styles));

const w = series(build, function watchAndServe() {
	watch(PATHS.files,                       files);
	watch(PATHS.imgFiles,                    images);
	watch(PATHS.htmlFiles,                   html);
	watch(PATHS.pugFiles,                    pug);
	watch(PATHS.jsFiles,                     scripts);
	watch([PATHS.cssFiles, PATHS.lessFiles], styles);
	
	browserSync.init(require('./bs-config'));
});

module.exports = {
	files,
	images,
	markup,
	scripts,
	styles,

	clean,
	build,
	watch: w,
	
	default: build
};
