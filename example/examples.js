
lEval = require('../lib/lisb-eval').lEval

const let        = 'let'
const cond       = 'cond'
const fn         = 'fn'
const mr         = 'mr'
const begin      = 'begin'
const list       = 'list'
const quote      = 'quote'
const unquote    = 'unquote'
const quasiquote = 'quasiquote'






const value = lEval([
	begin,

	[let, ':docopt',
		[':require', '../lib/module-docopt']],

	[':clog', ':docopt'],

	[let, ':args',
		[':docopt', [':from-lines',
			['list',
				"Usage:",
				"    tin <first> [seconds|minutes|hours]",
				"    tin <first> [seconds|minutes|hours] in [seconds|minutes|hours]",
				"",
				"    tin <first> [seconds|minutes|hours] <second> [seconds|minutes|hours]",
				"    tin <first> [seconds|minutes|hours] <second> [seconds|minutes|hours] in [seconds|minutes|hours]",
				"",
				"    tin (-h | --help | --version)",
				"",
				"Description:",
				"",
				"Tin computes time intervals.",
				"",
				"",
				"Options:",
				"    -h --help        Show this documentation.",
				"    --version        Show the current version",
				"",
				"Tin computes time intervals."
	]] ]],

	[':clog', ':args']






], {

	debug: true

})
