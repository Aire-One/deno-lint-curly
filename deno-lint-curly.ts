type NodeType =
  | Deno.lint.DoWhileStatement
  | Deno.lint.IfStatement
  | Deno.lint.ForInStatement
  | Deno.lint.ForOfStatement
  | Deno.lint.ForStatement
  | Deno.lint.WhileStatement;

const nodeTypeWordings = {
  DoWhileStatement: "do-while",
  IfStatement: "if",
  ForInStatement: "for-in",
  ForOfStatement: "for-of",
  ForStatement: "for",
  WhileStatement: "while",
} as const satisfies Record<NodeType["type"], string>;

const plugin = {
  name: "deno-lint-curly",
  rules: {
    "deno-lint-curly": {
      create(context) {
        function check(node: NodeType, body: Deno.lint.Statement) {
          if (body.type !== "BlockStatement") {
            context.report({
              node,
              message: `Use curly braces for \`${
                nodeTypeWordings[node.type]
              }\` statement`,
            });
          }
        }
        return {
          DoWhileStatement(node) {
            check(node, node.body);
          },
          IfStatement(node) {
            check(node, node.consequent);
          },
          ForInStatement(node) {
            check(node, node.body);
          },
          ForOfStatement(node) {
            check(node, node.body);
          },
          ForStatement(node) {
            check(node, node.body);
          },
          WhileStatement(node) {
            check(node, node.body);
          },
        };
      },
    },
  },
} satisfies Deno.lint.Plugin;

export default plugin;
