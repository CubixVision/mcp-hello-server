export const subtract = {
  name: "math.subtract",
  description: "Subtracts b from a",
  inputSchema: {
    type: "object",
    properties: {
      a: { type: "number" },
      b: { type: "number" }
    },
    required: ["a", "b"]
  },
  handler: async ({ input }: { input: { a: number; b: number } }) => {
    return input.a - input.b;
  }
}
