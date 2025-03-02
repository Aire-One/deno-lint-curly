import denoLintCurly from "./deno-lint-curly.ts";
import { expect } from "jsr:@std/expect";

function test(
  name: string,
  { code, expectedDiagnostics }: {
    code: string;
    expectedDiagnostics: Pick<Deno.lint.Diagnostic, "message">[];
  },
) {
  Deno.test(name, () => {
    const diagnostics = Deno.lint.runPlugin(
      denoLintCurly,
      "main.ts",
      code,
    );

    expect(diagnostics).toHaveLength(expectedDiagnostics.length);

    for (const expectedDiagnostic of expectedDiagnostics) {
      const diagnostic = diagnostics.shift();
      expect(diagnostic).toBeDefined();
      expect(diagnostic?.message).toEqual(expectedDiagnostic.message);
    }
  });
}

const testCases = [
  {
    name: "correct do-while statement",
    code: `
      do {
        console.log("Hello, world!");
      } while (true);`,
    expectedDiagnostics: [],
  },
  {
    name: "incorrect do-while statement",
    code: `do console.log("Hello, world!"); while (true);`,
    expectedDiagnostics: [{
      message: "Use curly braces for `do-while` statement",
    }],
  },
  {
    name: "correct if statement",
    code: `
      if (true) {
        console.log("Hello, world!");
      }`,
    expectedDiagnostics: [],
  },
  {
    name: "incorrect if statement",
    code: `if (true) console.log("Hello, world!");`,
    expectedDiagnostics: [{ message: "Use curly braces for `if` statement" }],
  },
  {
    name: "incorrect multiline if statement",
    code: `
      if (true)
        console.log("Hello, world!");`,
    expectedDiagnostics: [{ message: "Use curly braces for `if` statement" }],
  },
  {
    name: "correct if-else statement",
    code: `
      if (true) {
        console.log("Hello, world!");
      } else {
        console.log("Goodbye, world!");
      }`,
    expectedDiagnostics: [],
  },
  {
    name: "incorrect if-else statement",
    code: `
      if (true) console.log("Hello, world!");
      else console.log("Goodbye, world!");`,
    expectedDiagnostics: [{ message: "Use curly braces for `if` statement" }],
  },
  {
    name: "correct if-else-if statement",
    code: `
      if (true) {
        console.log("Hello, world!");
      } else if (false) {
        console.log("Goodbye, world!");
      } else {
        console.log("Goodbye, world!");
      }`,
    expectedDiagnostics: [],
  },
  {
    name: "incorrect if-else-if statement",
    code: `
      if (true) console.log("Hello, world!");
      else if (false) console.log("Goodbye, world!");
      else console.log("Goodbye, world!");`,
    expectedDiagnostics: [
      // TODO: Improve the test framework to dicerminate between multiple diagnostics
      { message: "Use curly braces for `if` statement" },
      { message: "Use curly braces for `if` statement" },
    ],
  },
  {
    name: "correct for-in statement",
    code: `
      for (const key in object) {
        console.log(key, object[key]);
      }`,
    expectedDiagnostics: [],
  },
  {
    name: "incorrect for-in statement",
    code: `for (const key in object) console.log(key, object[key]);`,
    expectedDiagnostics: [{
      message: "Use curly braces for `for-in` statement",
    }],
  },
  {
    name: "correct for-of statement",
    code: `
      for (const value of array) {
        console.log(value);
      }`,
    expectedDiagnostics: [],
  },
  {
    name: "incorrect for-of statement",
    code: `for (const value of array) console.log(value);`,
    expectedDiagnostics: [{
      message: "Use curly braces for `for-of` statement",
    }],
  },
  {
    name: "correct for statement",
    code: `
      for (let i = 0; i < array.length; i++) {
        console.log(array[i]);
      }`,
    expectedDiagnostics: [],
  },
  {
    name: "incorrect for statement",
    code: `for (let i = 0; i < array.length; i++) console.log(array[i]);`,
    expectedDiagnostics: [{ message: "Use curly braces for `for` statement" }],
  },
  {
    name: "correct while statement",
    code: `
      while (true) {
        console.log("Hello, world!");
      }`,
    expectedDiagnostics: [],
  },
  {
    name: "incorrect while statement",
    code: `while (true) console.log("Hello, world!");`,
    expectedDiagnostics: [{
      message: "Use curly braces for `while` statement",
    }],
  },
] as const satisfies readonly {
  name: string;
  code: string;
  expectedDiagnostics: { message: string }[];
}[];

for (const { name, ...testCase } of testCases) {
  test(name, testCase);
}

Deno.test("fix", () => {
  const diagnostics = Deno.lint.runPlugin(
    denoLintCurly,
    "main.ts",
    "if (true) console.log('Hello, world!');",
  );

  const { text: fixedCode } =
    // need to provide a type assertion here because the type is not correct and
    // PR https://github.com/denoland/deno/pull/28344 is not yet part of a
    // release
    (diagnostics[0].fix as unknown as Deno.lint.Fix[])[0];

  expect(fixedCode).toEqual(`{
console.log('Hello, world!');}`);
});
