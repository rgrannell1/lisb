#!/usr/bin/env node

const doc = [
	"Usage:",
	"	lisb"

]
.join('\n')

const docopt   = require("docopt").docopt
const readline = require('readline')
const args     = docopt(doc)

const lEval = require('../lib/lisb-eval').lEval

const let      = 'let'
const cond     = 'cond'
const fn        = 'fn'
const begin    = 'begin'
const list     = 'list'

const write    = process.stdout.write



const throwUnexpectedSymbol = function (line) {

}











var replState = {
	program: [
		begin
	],
	awaiting: false,
	awaitingBuffer: '',

}

const tryEval = function (text) {

	try {
		const expr = eval(text)

		return {
			awaiting: false,
			expr    : expr,
			text    : text
		}
	} catch (err) {
		return {
			awaiting: false,
			expr    : expr,
			text    : text
		}
	}

}





const autoComplete = function (partial) {

}





var replState = {
	program: [
		begin
	],
	awaiting: false,
	buffer  : ''
}




const pickPrompt = function (awaiting) {
	return awaiting? '+ ': '> '
}

var repl = readline.createInterface({
	input : process.stdin,
	output: process.stdout
})

repl.setPrompt(pickPrompt(repl.awaiting))

repl
.on('line', function (line) {

	repl.write(pickPrompt(repl.awaiting))
	console.log(line)

	replState.buffer += line

})
.on('SIGINT', function () {
	repl.question('Exit lisb repl (y/N)?', function (answer) {
		if (answer.match(/y|yes|q|quit|exit/i)) repl.close()
	})
})
