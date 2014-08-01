
LISB [![Build Status](https://travis-ci.org/rgrannell1/lisb.png?branch=master)](https://travis-ci.org/rgrannell1/lisb)
===============================

Lisb is a lisp-like toy language embedded in node.js. Unlike transpiled languages like ClojureScript,
Lisb code is valid JSON; it can be written alongside and used by JavaScript.

### Features

#### Currying

Lisb functions are curried, but multiple arguments can be passed to them with none of the
parentheses required by JS.

```js
[let, ':add',
	[fn, ':x'. [fn, ':y', [
		'+', ':x', ':y']] ]]

[[':add', 10], 2]
[':add', 10, 2]

12
```
### Macros

Lisb implements standard macro tools like `quote`, `quasiquote`, and `unquote`, as well
as functions with unevaluated arguments.

#### Threading

Lisb includes a threading macro, which turns programs inside out and expresses them as a value
passed through a chain of functions.

```js
['->',

	[':', 0, 100],

	[':map', [fn, ';x', [
		'*', ':x', ':x'
	]] ],

	[':map', [fn, ';x', [
		'+', ':x', ':x'
	]] ]

]
```

#### Immutable

Lisb has standard and destructuring assignment. All lisb values are immutable.

```js
[rlet, [':x',  ':y', ':z'], [1, 2, 3]]
```
