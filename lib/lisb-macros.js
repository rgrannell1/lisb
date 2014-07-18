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
		quasiquote, [quote,
			[unquote, [':from-chars',
				[list, ':', ':str']]] ]]]] ,

	[let, ':console',
		require('./lisb-console')],

	[let, ':import', [fn, ':colls', [

		quasiquote, [
			'rlet',
				[unquote,
					[':map', ':as-valname',
						[':keys-of', ':console']] ],
				[unquote,
					[':values-of', ':console']] ] ]] ],

	[':clog',
		[eval, [':import', ':console']] ],

	[':clog', ':info']


]) )

