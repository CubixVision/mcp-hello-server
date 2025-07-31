export const goodbye = {
  name: "goodbye",
  description: "Say goodbye to the user",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string" }
    },
    required: []
  },
  handler: async ({ input }: { input: { name?: string } }) => {
    return `Goodbye, ${input?.name || "friend"}!`
  }
}
