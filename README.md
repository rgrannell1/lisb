
LISB: Lost in a Sea of Brackets
===============================

lisb is a toy language embedded within JavaScript. Lisb is unlike most languages that target JavaScript
in that it isn't a transpiled; a lisb program parses as JavaScript.

### Syntax

Lisb only has four special forms:

let assigns a value to the global scope within a lisb program. Lisb values are
immutable.

```js
[let varname value]
```

cond is analogous to an if-statement; it executes its first expression if bool is true, executes
its seceond expression if bool if false, and throws an error otherwise.

```js
[cond bool expr0 expr1]
```

```js
[λ varname expr]
```

Begin runs expressions sequentially. The value of the final expression is returned by the evaluted program.

```js
[begin ...exprs]
```

### Standard Library
