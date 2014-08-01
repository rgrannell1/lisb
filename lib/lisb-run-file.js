#!/usr/bin/env node

const doc = [
	"Usage:",
	"    lisb <path> [-d|--debug]",
	"    lisb (-h | --help | --version	)",
	"",
	"Description:",
	"",
	"Arguments:",
	"    <path>     The path of the lisb file to execute.",
	"Options:",
	"    --debug    Should each intermediate expression be printed?",
	""
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






// append special form keywords to file.

const contents = [
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
	contents,
	lEvalCall(lisbProgram, {
		'debug': true
	})
)

process.stdout.write(
	JSON.stringify(eval(fullText)) )
