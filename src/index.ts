import * as http from 'http'
import * as fs from 'fs'
import * as path from 'path'
import { tools } from './tools'

const PORT = 3000

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/test') {
    const filePath = path.join(__dirname, '../public/test.html')
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500)
        res.end('Error loading test.html')
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(data)
      }
    })
    return
  }

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
    return
  }

  if (req.method === 'POST' && req.url === '/prompt') {
    let body = ''
    req.on('data', chunk => (body += chunk))
    req.on('end', async () => {
      try {
        const { prompt } = JSON.parse(body)
        const match = prompt.match(/^\/([\w\.]+)\s*(.*)$/)

        if (!match) {
          res.writeHead(400)
          return res.end('Invalid prompt format')
        }

        const toolName = match[1]
        const argsString = match[2]
        const tool = tools[toolName as keyof typeof tools]

        if (!tool) {
          res.writeHead(404)
          return res.end(`Tool "${toolName}" not found`)
        }

        const input: Record<string, any> = {}
        argsString.split(/\s+/).forEach((pair: string) => {
          const [key, val] = pair.split('=')
          if (key && val !== undefined) {
            const numVal = Number(val)
            input[key] = isNaN(numVal) ? val : numVal
          }
        })

        const result = await tool.handler({ input } as any)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result))
      } catch (err) {
        res.writeHead(400)
        res.end('Failed to parse prompt')
      }
    })

    return
  }

  if (req.method === 'POST' && req.url === '/nl') {
    let body = ''
    req.on('data', chunk => (body += chunk))
    req.on('end', async () => {
      try {
        const { text } = JSON.parse(body)

       
        let prompt = '';
        const lower = text.toLowerCase();

        // Add
        if (lower.match(/add (\d+) (and|to|with) (\d+)/)) {
          const [, a, , b] = lower.match(/add (\d+) (and|to|with) (\d+)/)!;
          prompt = `/math.add a=${a} b=${b}`;

          // Subtract
        } else if (lower.match(/(subtract|minus) (\d+) (from|and) (\d+)/)) {
          const [, , b, , a] = lower.match(/(subtract|minus) (\d+) (from|and) (\d+)/)!;
          prompt = `/math.subtract a=${a} b=${b}`;

          // Multiply
        } else if (lower.match(/multiply (\d+) (and|by) (\d+)/)) {
          const [, a, , b] = lower.match(/multiply (\d+) (and|by) (\d+)/)!;
          prompt = `/math.multiply a=${a} b=${b}`;

          // Divide
        } else if (lower.match(/divide (\d+) (by|into) (\d+)/)) {
          const [, a, , b] = lower.match(/divide (\d+) (by|into) (\d+)/)!;
          prompt = `/math.divide a=${a} b=${b}`;

          // Hello
        } else if (lower.match(/say hello to (\w+)/)) {
          const [, name] = lower.match(/say hello to (\w+)/)!;
          prompt = `/hello name=${name}`;

        } else {
          res.writeHead(400);
          return res.end('Sorry, I could not understand that.');
        }


        // Reuse the /prompt logic by calling it internally
        const toolName = prompt.match(/^\/([\w\.]+)/)?.[1]
        if (!toolName || !(toolName in tools)) {
          res.writeHead(404)
          return res.end(`No tool found for prompt: ${prompt}`)
        }

        const argsString = prompt.replace(/^\/[\w\.]+\s*/, '')
        const input: Record<string, any> = {}
        argsString.split(/\s+/).forEach((pair: string) => {
          const [key, val] = pair.split('=')
          if (key && val !== undefined) {
            const numVal = Number(val)
            input[key] = isNaN(numVal) ? val : numVal
          }
        })

        const result = await tools[toolName as keyof typeof tools].handler({ input: input as any })
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ prompt, result }))
      } catch (err) {
        res.writeHead(400)
        res.end('Failed to parse input')
      }
    })

    return
  }



// Default: homepage
res.writeHead(200, { 'Content-Type': 'text/plain' })
res.end('MCP server running. Try /test or POST to /tools/hello')
})

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
