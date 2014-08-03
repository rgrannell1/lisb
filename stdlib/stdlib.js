
const nonLazy = function (func) {
	func.isMacro = false
	return func
}




var stdlib = {}

stdlib[':map'] = {

	docs: {
		title: "map",
		description: "apply a function to each element of a collection.".
		type: "(any -> any) -> [any] -> [any]"
	},

	def: nonLazy(function (fn) {
		return nonLazy(function (coll) {
			return list(unlist(coll).map(fn))
		})
	}),

	tests: [

		over_('coll')

		.describe('map identity holds')
		.holdsWhen_(
			is.array,

			function (coll) {

				return E([
					':is?',
					[':map', ':identity', L(coll)], L(coll)
				])

			}
		)

		.run( )

	]

}





module.exports = stdlib
