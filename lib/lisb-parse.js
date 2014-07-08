
const match = require('./flotsam').match











const lisbParse = ( function () {

	const validate = {
		quote : function (EXPR) {

		},
		cond  : function (EXPR) {

		},
		let   : function (EXPR) {

		},
		λ     : function (EXPR) {

		},
		begin : function (EXPR) {

		}
	}

	return function (EXPR) {

		const PROC     = EXPR[0]
		const PROCARGS = EXPR.slice(1)

		match(
			[proc], [
				[['quote'], function (EXPR) {
					validate.quote(EXPR)
					PROCARGS.map(lisbParse)
				}],
				[['cond'],  function (EXPR) {
					validate.cond(EXPR)
					PROCARGS.map(lisbParse)
				}],
				[['let'],   function (EXPR) {
					validate.let(EXPR)
					PROCARGS.map(lisbParse)
				}],
				[['λ'],     function (EXPR) {
					validate.λ(EXPR)
					PROCARGS.map(lisbParse)
				}],
				[['begin'], function (EXPR) {
					validate.begin(EXPR)
					PROCARGS.map(lisbParse)
				}]
			]
		)
	}

} )()


