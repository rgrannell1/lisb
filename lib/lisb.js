#!/usr/bin/env node

const doc = [
	"Usage:",
	"    lisb <path> [-d|--debug] [-o|--out]",
	"    lisb (-h | --help | --version)",
	"",
	"Description:",
	"",
	"Lisb is a lisp-like language.",
	"",
	"",
	"",
	"",
	"",
	"Arguments:",
	"    <path>         The path of the lisb file to execute.",
	"                   Lisb files have the file extension .lb",
	"Options:",
	"    -d, --debug    Should the program be run in debug mode?",
	"                   Running in debug mode prints each intermediate.",
	"                   expression generated during execution.",
	"    -o, --out      Should the compiled program be output to the console."
].
join('\n')






const docopt = require("docopt").docopt
const fs     = require("fs")
const is     = require("is")

var   lEval  = require("./lisb-eval").lEval
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





var lisbProgram =
	fs.readFileSync(args['<path>']).toString()

if (lisbProgram.charAt(0) === '#' && lisbProgram.charAt(1) == '!') {
	lisbProgram = lisbProgram.replace(/^.+\n/, '')
}

const fullText = addHeader(
	"var lEval = require('/home/ryan/Code/lisb.js/lib/lisb-eval').lEval\n\n" +
	specialForms,
	lEvalCall(lisbProgram, {
		'debug': args['-d'] || args['--debug']
	})
)

if (args['-o'] || args['--out']) {
	console.log(fullText)
} else {
	console.log(
		JSON.stringify(eval(fullText)) )
}
