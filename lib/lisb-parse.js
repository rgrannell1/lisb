
const match = require('./flotsam').match
const _     = undefined











const lisbParse = ( function () {

	const validate = {
		quote : function (EXPR) {
			console.assert(EXPR.length === 2, 'quote error:')
			PROCARGS.map(lisbParse)
		},
		cond  : function (EXPR) {
			console.assert(EXPR.length === 3, 'cond error:')
			PROCARGS.map(lisbParse)
		},
		let   : function (EXPR) {
			console.assert(EXPR.length === 2, 'let error:')
			PROCARGS.map(lisbParse)
		},
		λ     : function (EXPR) {
			console.assert(EXPR.length === 3, 'λ error:')
			PROCARGS.map(lisbParse)
		},
		begin : function (EXPR) {
			PROCARGS.map(lisbParse)
		},
		'expr': function (EXPR) {
			PROCARGS.map(lisbParse)
		}
	}

	return function (EXPR) {

		const PROC     = EXPR[0]
		const PROCARGS = EXPR.slice(1)

		match(
			[PROC], [
				[['quote'], validate.quote(EXPR) ],
				[['cond'],  validate.cond(EXPR)  ],
				[['let'],   validate.let(EXPR)   ],
				[['λ'],     validate.λ(EXPR)     ],
				[['begin'], validate.begin(EXPR) ],
				[[_],       validate.expr(EXPR)  ]
			]
		)
	}

} )()

module.exports = {
	lisbParse: lisbParse
}
