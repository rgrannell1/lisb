#!/usr/bin/env node

/*
	Path Module


*/

const asModule = require('./flotsam').asModule

const path = require('path')

module.exports =
	asModule({
		normalize: function (str) {
			return path.normalize(str)
		},
		normalise: function (str) {
			return path.normalize(str)
		},
		join: function (strs) {
			return path.join.apply(strs)
		},
		resolve: function (strs, str0) {
			return path.resolve(strs.concat(str0))
		},
		relative: function (str0, str1) {
			return path.relative(str0, str1)
		},
		dirname: function (str) {
			return path.dirname(str)
		},
		basename: function (str0, str1) {
			return path.basename(str0, str1)
		},
		extname: function (str) {
			return path.extname(str)
		},
		sep: path.sep,
		delimiter: path.delimiter
	})
