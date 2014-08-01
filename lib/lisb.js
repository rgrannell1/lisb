#!/usr/bin/env node

const doc = [
	"Usage:",
	"    lisb <path> [-d|--debug]",
	"    lisb (-h | --help | --version)",
	"",
	"Description:",
	"",
	"Lisb is a lisp-like language embedded with its S-expressions ",
	"embedded in JSON.",
	"",
	"Arguments:",
	"    <path>     The path of the lisb file to execute.",
	"               Lisb files have the file extension .lb",
	"Options:",
	"    --debug    Should the program be run in debug mode?",
	"               Running in debug mode prints each intermediate.",
	"               expression generated during execution."
].
join('\n')






const docopt = require("docopt").docopt
const fs     = require("fs")
const is     = require("is")

const lEval  = require("./lisb-eval").lEval
const args   = docopt(doc)




const addHeader = function (header, body) {
	return header + body
}

const lEvalCall = function (body, opts) {
	return 'lEval(' + body + ', ' + JSON.stringify(opts) + ')'
}






/*
	specialForms

	These special forms are bound as JavaScript
	functions when executing a lisb program.
*/

const specialForms = [
	"var let          = 'let';",
	"var cond         = 'cond';",
	"var fn           = 'fn';",
	"var mr           = 'mr';",
	"var begin        = 'begin';",
	"var list         = 'list';",
	"var quote        = 'quote';",
	"var unquote      = 'unquote';",
	"var quasiquote   = 'quasiquote';",
	"\n"
].
join('\n')


const lisbProgram =
	fs.readFileSync(args['<path>']).toString()

const fullText = addHeader(
	specialForms,
	lEvalCall(lisbProgram, {
		'debug': true
	})
)

process.stdout.write(
	JSON.stringify(eval(fullText)) )
