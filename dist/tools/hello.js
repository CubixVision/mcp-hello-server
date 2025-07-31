"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = void 0;
exports.hello = {
    name: "hello",
    description: "Say hello to the user",
    inputSchema: {
        type: "object",
        properties: {
            name: { type: "string" }
        },
        required: []
    },
    handler: async ({ input }) => {
        return `Hello, ${input?.name || "World"}!`;
    }
};
