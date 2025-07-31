export const divide = {
  name: "math.divide",
  description: "Divides a by b",
  inputSchema: {
    type: "object",
    properties: {
      a: { type: "number" },
      b: { type: "number" }
    },
    required: ["a", "b"]
  },
  handler: async ({ input }: { input: { a: number; b: number } }) => {
    if (input.b === 0) throw new Error("Division by zero");
    return input.a / input.b;
  }
}
