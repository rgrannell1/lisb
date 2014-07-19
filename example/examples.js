
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

	[let, ':console',
		[':require', '../lib/module-console']],

	[let, ':path',
		[':require', '../lib/module-path']],






	['eval',
		[':import', [list, 'log'], ':console']],

	[ ':log',
		[['@', 'join', ':path'], [list, '/home', 'ryan']] ]


], {

	debug: false

})
