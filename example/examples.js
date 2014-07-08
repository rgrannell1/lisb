
lisbValidate = require('../lib/lisb-parse').lisbValidate

const quote  = 'quote'
const cond   = 'cond'
const let    = 'let'
const λ      = 'λ'
const begin  = 'begin'



lisbValidate([
	begin,
	[ let, ':double',
		[λ, ':num' ['*', 2, ':num']] ],
	[':double', 10]
])
