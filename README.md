# deno-lint-curly

A minimal implementation of the
[eslint curly](https://eslint.org/docs/latest/rules/curly) rule for
[deno lint](https://docs.deno.com/runtime/reference/cli/lint/).

```json
{
  "lint": {
    "plugins": ["jsr:@aireone/deno-lint-curly"]
  }
}
```

## deno-lint-curly/deno-lint/curly

Enforce braces for all control statements.

JavaScript/TypeScript allow the omission of curly braces when a block contains
only one statement. However, it is considered by many to be best practice to
never omit curly braces around blocks, even when they are optional, because it
can lead to bugs and reduces code clarity

```ts
// Bad
if (foo) foo++;

for (let i = 0; i < 10; i++) console.log(i);

while (bar) bar--;

// Good
if (foo) {
  foo++;
}

for (let i = 0; i < 10; i++) {
  console.log(i);
}

while (bar) {
  bar--;
}
```
