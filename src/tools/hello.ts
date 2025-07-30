export const hello = {
  name: "hello",
  description: "Say hello to the user",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string" }
    },
    required: []
  },
  handler: async ({ input }: { input: { name?: string } }) => {
    return `Hello, ${input?.name || "World"}!`
  }
}
