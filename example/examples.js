
lisbEval = require('../lib/lisb-eval').lisbEval

const let    = 'let'
const cond   = 'cond'
const fn      = 'fn'
const begin  = 'begin'
const list   = 'list'




console.log( lisbEval([
	begin,

	[let,
		[list, ':x', ':y', ':z'],
		[list, 1,    2,    3]],

	[':map',
		[fn,
			':x', ['*', ':x', ':x']],
		[list, ':x', ':y', ':z'] ]

]) )
