"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = void 0;
exports.add = {
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
    handler: async ({ input }) => {
        return input.a + input.b;
    }
};
