export const add = {
  name: "math.add",
  description: "Adds two numbers together",
  inputSchema: {
    type: "object",
    properties: {
      a: { type: "number" },
      b: { type: "number" }
    },
    required: ["a", "b"]
  },
  handler: async ({ input }: { input: { a: number, b: number } }) => {
    return input.a + input.b
  }
}
