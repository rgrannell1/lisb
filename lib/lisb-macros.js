#!/usr/bin/env node

const lEval = require('./lisb-eval').lEval

const let          = 'let'
const cond         = 'cond'
const fn           = 'fn'
const mr           = 'mr'
const begin        = 'begin'
const list         = 'list'
const eval         = 'eval'
const quote        = 'quote'
const unquote      = 'unquote'
const quasiquote   = 'quasiquote'






console.log( lEval([
	begin,

	[let, ':as-valname', [fn, ':str', [
		// string -> valname
		// append ':' to the front of a string.
		quasiquote, [quote,
			[unquote, [':from-chars',
				[list, ':', ':str']]] ]]]],

	[let, ':import', [fn, ':keys', [fn, ':colls', [
		begin,

		[let, ':to-import',
			[':select',
				[fn, ':coll', [
					':in?', [':at', 0, ':coll'], ':keys']],
				':colls']],

		[quasiquote, [
			'rlet',
				[unquote,
					[':map', ':as-valname',
						[':keys-of', ':to-import']] ],
				[unquote,
					[':values-of', ':to-import']] ] ]] ]] ],






	[let, ':console',
		require('./lisb-console')],

	['eval',
		[':import', [list, 'trace', 'info'], ':console']]



]) )

