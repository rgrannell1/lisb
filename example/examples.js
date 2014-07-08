
lisbParse = require('../lib/lisb-parse').lisbParse

const quote  = 'quote'
const cond   = 'cond'
const let    = 'let'
const λ      = 'λ'
const begin  = 'begin'



lisbParse([
	begin,
	[let, ':x', 10],
	[let, ':y', [
		'*', ':x', ':x']]
])
