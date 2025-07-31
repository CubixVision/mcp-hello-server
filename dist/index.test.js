"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const http_1 = __importDefault(require("http"));
describe('MCP Server', () => {
    it('should respond with Hello from MCP TypeScript server!', (done) => {
        const server = http_1.default.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Hello from MCP TypeScript server!');
        });
        server.listen(0, () => {
            const port = server.address().port;
            http_1.default.get(`http://localhost:${port}`, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    assert_1.strict.equal(data, 'Hello from MCP TypeScript server!');
                    server.close();
                    done();
                });
            });
        });
    });
});
