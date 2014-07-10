
lisbEval = require('../lib/lisb-eval').lisbEval

const let    = 'let'
const cond   = 'cond'
const λ      = 'λ'
const begin  = 'begin'
const list   = 'list'

const result = lisbEval([
	begin,
	[let, ':coll0', [list, 1, 2, 3, 4, 5]],
	[let, ':coll1',
		[ ':take', 2, [':reverse', ':coll0']] ],
	[let, ':coll2',
		['λ', ':x', [
			[begin,
				[':clog', ':x']
			]
		]] ],
	[':coll1']
])



console.log(result)
