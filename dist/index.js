"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const tools_1 = require("./tools");
const PORT = 3000;
const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/test') {
        const filePath = path.join(__dirname, '../public/test.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading test.html');
            }
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
        return;
    }
    if (req.method === 'POST' && req.url?.startsWith('/tools/')) {
        const toolName = req.url.split('/')[2];
        const tool = tools_1.tools[toolName];
        if (!tool) {
            res.writeHead(404);
            return res.end(`Tool "${toolName}" not found`);
        }
        let body = '';
        req.on('data', chunk => (body += chunk));
        req.on('end', async () => {
            try {
                const { input } = JSON.parse(body);
                const result = await tool.handler({ input });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            }
            catch (err) {
                res.writeHead(400);
                res.end('Invalid input');
            }
        });
        return;
    }
    if (req.method === 'POST' && req.url === '/prompt') {
        let body = '';
        req.on('data', chunk => (body += chunk));
        req.on('end', async () => {
            try {
                const { prompt } = JSON.parse(body);
                const match = prompt.match(/^\/([\w\.]+)\s*(.*)$/);
                if (!match) {
                    res.writeHead(400);
                    return res.end('Invalid prompt format');
                }
                const toolName = match[1];
                const argsString = match[2];
                const tool = tools_1.tools[toolName];
                if (!tool) {
                    res.writeHead(404);
                    return res.end(`Tool "${toolName}" not found`);
                }
                const input = {};
                argsString.split(/\s+/).forEach(pair => {
                    const [key, val] = pair.split('=');
                    if (key && val !== undefined) {
                        const numVal = Number(val);
                        input[key] = isNaN(numVal) ? val : numVal;
                    }
                });
                const result = await tool.handler({ input });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            }
            catch (err) {
                res.writeHead(400);
                res.end('Failed to parse prompt');
            }
        });
        return;
    }
    // Default: homepage
    res.writeHead(200);
    res.end('MCP server running. Try /test or POST to /tools/hello');
});
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
