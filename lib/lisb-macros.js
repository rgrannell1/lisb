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

	[let, ':import', [fn, ':colls', [
		// [[any]] -> [any]
		// create a code block that assigns a module to the local scope.
		quasiquote, [
			'rlet',
				[unquote,
					[':map', ':as-valname',
						[':keys-of', ':console']] ],
				[unquote,
					[':values-of', ':console']] ] ]] ],


	[':import', [':log'], ':console'],


	[let, ':console',
		require('./lisb-console')],


]) )

