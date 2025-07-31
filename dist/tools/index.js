"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tools = void 0;
// src/tools/index.ts
const hello_1 = require("./hello");
const goodbye_1 = require("./goodbye");
const add_1 = require("./math/add");
exports.tools = {
    hello: hello_1.hello,
    goodbye: goodbye_1.goodbye,
    "math.add": add_1.add
};
