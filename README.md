
LISB: Lost in a Sea of Brackets
===============================

lisb is a toy language embedded within JavaScript. Lisb is unlike most languages that target JavaScript
in that lisb code is made from ordinary JavaScript data-structures.

```js
lisbEval([
	begin,
	[let, ':coll0', [list, 1, 2, 3, 4, 5]],
	[let, ':coll1',
		[ ':take', 2, [':reverse', ':coll0']] ],
	[let, ':double',
		['λ', ':x', [
			[begin,
				[':clog', ':x'],
				['+', ':x', ':x']
			]
		]] ],
	[':double', 10]
])
```

Clunkly syntax aside, the language is reasonably powerful; it has arrays, numbers, booleans,
keyworks and strings, and a fairly complete collections library. Lisb also has unary lamda
functions, with function call semantics that get rid of the extra parens curried functions
require in JavaScript.

Lisb uses applicative-order evalutation, and is not designed for lisp-style metaprogramming. That
said, JavaScript's collection functions can be used to dynamically write Lisb programs due to their
shared syntax.

### Syntax

Lisb has five special forms:

let assigns a value to the current scope within a lisb program. Lisb values are
immutable.

```js
[let varname value]
```

cond is analogous to an if-statement; it executes its first expression if bool is true, executes
its seceond expression if bool if false, and throws an error otherwise.

```js
[cond bool expr0 expr1]
```

list, as the name implies, constructs a list from an arbritrary number of arguments.

```js
['list', ...exprs]
```

λ creates a unary function that lexically-inherits variables bound in its creating scope.

```js
[λ varname expr]
```

Begin runs expressions sequentially. The value of the final expression is returned by the
evaluted program.

```js
[begin ...exprs]
```

### Standard Library

**Operators:**

```js
'+', '-', '*', '/', '&', '|', '='
```

**Functions:**

```js
':clog'

':all-of'
':any-of'
':append'
':arityof'
':at'
':capture'
':chop'
':chunk'
':compose'
':cycle'
':drop'
':drop-while'
':explode'
':falsity'
':first-as'
':first-of'
':at'
':flat-map'
':flatten'
':fourth-as'
':fourth-of'
':at'
':from-chars'
':from-lines'
':from-words'
':group-by'
':identity'
':implode'
':indices-of'
':init-of'
':is'
':empty?'
':fold'
':false?'
':keys-of'
':at'
':match?'
':member?'
':nan?'
':true?'
':join'
':last-as'
':last-of'
':len-of'
':locate'
':which'
':map'
':max-by'
':min-by'
':none-of'
':not'
':not-empty?'
':not-false?'
':not-match?'
':not-member?'
':not-nan?'
':not-true?'
':one-of'
':poll'
':prepend'
':reduce'
':reject'
':repeat'
':rest-of'
':reverse'
':scan'
':second-as'
':second-of'
':at'
':select'
':fold'
':shuffle'
':slice'
':sort-by'
':take-while'
':take'
':third-as'
':third-of'
':at'
':to-chars'
':explode'
':to-lines'
':explode'
':to-words'
':explode'
':truth'
':unit'
':unzip-indices'
':values-of'
':at'
':where'
':zip'
```

