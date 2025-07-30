import { strict as assert } from 'assert';
import http from 'http';

describe('MCP Server', () => {
  it('should respond with Hello from MCP TypeScript server!', (done) => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Hello from MCP TypeScript server!');
    });
    server.listen(0, () => {
      const port = (server.address() as any).port;
      http.get(`http://localhost:${port}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          assert.equal(data, 'Hello from MCP TypeScript server!');
          server.close();
          done();
        });
      });
    });
  });
});
