
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






lEval([
	begin,

	[let, ':console',
		[':require', '../lib/lisb-console']],

	[':import', [list, 'info'], ':console']








], {

	debug: false

})
