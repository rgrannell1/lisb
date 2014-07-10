#!/usr/bin/env node

const doc = [
	"Usage:",
	"	lisb"

]
.join('\n')

const docopt   = require("docopt").docopt
const args     = docopt(doc)

const lisbEval = require('../lib/lisb-eval').lisbEval

const let      = 'let'
const cond     = 'cond'
const λ        = 'λ'
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
		eval(text)
	} catch (err) {
		return {
			awaiting: false,
			expr    : expr,
			text    : text
		}
	}

}

process.stdin.resume()
process.stdin.setEncoding('utf8')

process.stdout.write('> ')

process.stdin.on('data', function (text) {

	if (!replState.awaiting) {

		const lineInfo = tryEval(text)

		if (!tryEval.awaiting) {

			replState.program.push(lineInfo.expr)
			process.stdout.write('> ')

		} else {

			replState.awaiting       = true
			replState.awaitingBuffer += text

			process.stdout.write('+ ')
		}

		try {
			console.dir(lisbEval(replState.program))
		} catch (err) {

			replState.program =
				replState.program.slice(0, replState.program.length - 1)

			console.log(err)

		}

	}

	process.stdout.write('> ')
})
