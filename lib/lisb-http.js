
var http   = require('http')
var module = {}

module.['create-server'] = function (fn) {
	return http.createServer(fn)
}

module.exports = module
