import * as http from 'http'
import { tools } from './tools'

const PORT = 3000

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url?.startsWith('/tools/')) {
    const toolName = req.url.split('/')[2]
    const tool = tools[toolName as keyof typeof tools]

    if (!tool) {
      res.writeHead(404)
      return res.end(`Tool "${toolName}" not found`)
    }

    let body = ''
    req.on('data', chunk => (body += chunk))
    req.on('end', async () => {
      try {
        const { input } = JSON.parse(body)
        const result = await tool.handler({ input })
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result))
      } catch (err) {
        res.writeHead(400)
        res.end('Invalid input')
      }
    })
  } else {
    res.writeHead(404)
    res.end('Not found')
  }
})

server.listen(PORT, () => {
  console.log(`MCP-style server running at http://localhost:${PORT}`)
})
