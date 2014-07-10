#!/usr/bin/env node

const doc = [
	"Usage:",
	"	lisb"

]
.join('\n')

const docopt = require("docopt").docopt
const args   = docopt(doc)

process.stdin.resume()
process.stdin.setEncoding('utf8')

process.stdin.on('data', function (text) {


	console.log(text)



})

