'use strict';

module.exports = {
	files: ['dist/**'],
	middleware: [
		(_, res, next) => {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Cache-Control', 'no-store');
			next();
		}
	],
	reloadDebounce: 500,
	server: {
		baseDir: 'dist'
	}
};
