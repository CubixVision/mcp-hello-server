"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goodbye = void 0;
exports.goodbye = {
    name: "goodbye",
    description: "Say goodbye to the user",
    inputSchema: {
        type: "object",
        properties: {
            name: { type: "string" }
        },
        required: []
    },
    handler: async ({ input }) => {
        return `Goodbye, ${input?.name || "friend"}!`;
    }
};
