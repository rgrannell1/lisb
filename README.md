
LISB [![Build Status](https://travis-ci.org/rgrannell1/lisb.png?branch=master)](https://travis-ci.org/rgrannell1/lisb)
===============================

Lisb (Lost in a Sea of Brackets) is a language embedded within JavaScript. Lisb is unlike most languages that target JS
in that lisb code is made from ordinary JS data-structures. Lisb isn't meant to be a
contender for Transpiled JS Language of The Year, but it will hopefully develop into an interesting
toy language.

Lisb programs are built from JS literals like arrays, strings, numbers and functions, which are
then evaluated by Lisb's custom interpretor [1]. Most transpiled languages must transform non-JS
source to JS before running; lisb is JS all the way down. One nice side-effect of
Lisb-programs being first-class citizens of JS is that JS can be used to dynamically
write Lisb, adding metaprogramming without the unconstrained horrors of `eval`.

### Technical Features

* All lisb functions are curried, and curried functions can be invoked without extra brackets. This
makes partial application easy.

* Lisb is lexically-scoped, with applicative-order evaluation.

* Lisb implements expression quotation & quasi-quotation.

```js
const prog0 =
[
	begin,

	[let, ':coll0', [list, 1, 2, 3, 4, 5]],

	[let, ':coll1',
		[ ':take', 2, [':reverse', ':coll0']] ],

	[let, ':double',
		['fn', ':x', [
			[begin,
				[':clog', ':x'],
				['+', ':x', ':x']] ]] ],

	[':double', 10]
]

const prog1 =
[
	begin,

	[let, ':inc', [
		fn, ':x', ['+', ':x', 1] ]],

	[':map', ':inc', ['list', 1, 2, 3, 4]]

]

const prog2 =
[
	begin,

	[let,
		[list, ':x', ':y', ':z'],
		[list, 1,    2,    3]],

	[':map',
		[fn,
			':x', ['*', ':x', ':x']],
		[list, ':x', ':y', ':z'] ]

]

lEval(prog0)
lEval(prog1)
lEval(prog2)
```

Clunkly syntax aside, the language is reasonably powerful; it has arrays, numbers, booleans,
keyworks and strings, and a fairly complete collections library. Lisb also has unary lamda
functions, with function call semantics that get rid of the extra parens curried functions
require in JavaScript.

[1] Which, ironically, never resorts to using `eval`.
