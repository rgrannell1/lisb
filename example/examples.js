
lisbEval = require('../lib/lisb-eval').lisbEval

const let    = 'let'
const cond   = 'cond'
const λ      = 'λ'
const begin  = 'begin'
const list   = 'list'

/*
const result = lisbEval([
	begin,
	[let, ':coll0', [list, 1, 2, 3, 4, 5]],
	[let, ':coll1',
		[ ':take', 2, [':reverse', ':coll0']] ],
	[let, ':double',
		[λ, ':x', [
			[begin,
				[':clog', ':x'],
				['+', ':x', ':x']
			]
		]] ],
	[':double', 10]
])

console.log(
	lisbEval([
		begin,

		[let, ':inc', [
			λ, ':x', ['+', ':x', 1] ]],

		[':map', ':inc', ['list', 1, 2, 3, 4]]



	])
)
*/

/*
console.log(
	lisbEval(
	['@', 3, ['list',
		['list', 2, 1],
		['list', 3, 2],
		['list', 2, 4]
	]]
))
*/
