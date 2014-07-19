#!/usr/bin/env node

const readline     = require('readline')
const lEval        = require('../lib/lisb-eval').lEval

const let          = 'let'
const cond         = 'cond'
const fn           = 'fn'
const mr           = 'mr'
const begin        = 'begin'
const list         = 'list'
const eval         = 'eval'
const quote        = 'quote'
const unquote      = 'unquote'
const quasiquote   = 'quasiquote'


const write        = process.stdout.write






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




const events = {
	exit: function (answer) {
		if (answer.match(/y|yes|q|quit|exit/i)) {
			repl.close()
		}
	}
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

	replState.buffer += line

})
.on('SIGINT', events.exit)
