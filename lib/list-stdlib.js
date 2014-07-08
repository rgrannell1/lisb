
/*
	-- special forms
*/

const quote  = 'quote'
const cond   = 'cond'
const let    = 'let'
const λ      = 'λ'
const begin  = 'begin'

/*
	-- standard functions
*/

var internal = {}

internal.add = function (e1, e2) {
	return e1 + e2
}

module.exports = {
	quote  : 'quote',
	cond   : 'cond',
	let    : 'let',
	λ      : 'λ',
	begin  : 'begin'
}
