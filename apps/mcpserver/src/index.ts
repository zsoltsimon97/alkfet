import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'
import axios, { AxiosError } from 'axios'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js'
import * as z from 'zod/v4'

const backendBase = process.env.BACKEND_URL ?? 'http://localhost:3000'
const client = axios.create({ baseURL: backendBase })

const taskStatus = z.enum(['todo', 'in_progress', 'done'])
const taskPriority = z.enum(['low', 'medium', 'high'])
const projectStatus = z.enum(['active', 'archived'])

const toCallResult = (data: unknown) => {
  const structuredContent: Record<string, unknown> = Array.isArray(data)
    ? { items: data }
    : data && typeof data === 'object'
      ? (data as Record<string, unknown>)
      : { value: data }

  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data) }],
    structuredContent,
  }
}

const toErrorResult = (error: unknown) => {
  const axiosError = error as AxiosError<{ message?: string }>
  const status = axiosError.response?.status ?? 502
  const message = axiosError.response?.data?.message ?? axiosError.message ?? 'Gateway error'
  return {
    content: [{ type: 'text' as const, text: JSON.stringify({ status, message }) }],
    structuredContent: { status, message },
  }
}

const createMcpServer = () => {
  const server = new McpServer({ name: 'alkfet-mcp', version: '1.0.0' })

  server.registerTool(
    'create-project',
    {
      title: 'Projekt létrehozása',
      description: 'Új projekt létrehozása a rendszerben.',
      inputSchema: z.object({
        name: z.string().min(1),
        description: z.string().max(2000).optional(),
        status: projectStatus.optional(),
      }),
    },
    async ({ name, description, status }) => {
      try {
        const response = await client.post('/projects', { name, description, status })
        return toCallResult(response.data)
      } catch (error) {
        return toErrorResult(error)
      }
    },
  )

  server.registerTool(
    'list-projects',
    {
      title: 'Projektek listázása',
      description: 'Az összes projekt lekérdezése a rendszerből.',
      inputSchema: z.object({}).optional(),
    },
    async () => {
      try {
        const response = await client.get('/projects')
        return toCallResult(response.data)
      } catch (error) {
        return toErrorResult(error)
      }
    },
  )

  server.registerTool(
    'update-project',
    {
      title: 'Projekt módosítása',
      description: 'Meglévő projekt adatainak módosítása.',
      inputSchema: z.object({
        id: z.number().int().min(1),
        name: z.string().min(1).optional(),
        description: z.string().max(2000).optional(),
        status: projectStatus.optional(),
      }),
    },
    async ({ id, ...payload }) => {
      try {
        const response = await client.patch(`/projects/${id}`, payload)
        return toCallResult(response.data)
      } catch (error) {
        return toErrorResult(error)
      }
    },
  )

  server.registerTool(
    'create-task',
    {
      title: 'Feladat létrehozása',
      description: 'Új feladat létrehozása egy projekthez.',
      inputSchema: z.object({
        projectId: z.number().int().min(1),
        title: z.string().min(1).max(200),
        description: z.string().max(2000).optional(),
        status: taskStatus.optional(),
        priority: taskPriority.optional(),
        dueDate: z.string().optional(),
      }),
    },
    async (payload) => {
      try {
        const response = await client.post('/tasks', payload)
        return toCallResult(response.data)
      } catch (error) {
        return toErrorResult(error)
      }
    },
  )

  server.registerTool(
    'list-tasks-by-project',
    {
      title: 'Projekt feladatainak listázása',
      description: 'Egy adott projekthez tartozó feladatok lekérdezése.',
      inputSchema: z.object({
        projectId: z.number().int().min(1),
      }),
    },
    async ({ projectId }) => {
      try {
        const response = await client.get('/tasks', { params: { projectId } })
        return toCallResult(response.data)
      } catch (error) {
        return toErrorResult(error)
      }
    },
  )

  server.registerTool(
    'update-task',
    {
      title: 'Feladat módosítása',
      description: 'Meglévő feladat adatainak módosítása.',
      inputSchema: z.object({
        id: z.number().int().min(1),
        projectId: z.number().int().min(1).optional(),
        title: z.string().min(1).max(200).optional(),
        description: z.string().max(2000).optional(),
        status: taskStatus.optional(),
        priority: taskPriority.optional(),
        dueDate: z.string().optional(),
      }),
    },
    async ({ id, ...payload }) => {
      try {
        const response = await client.patch(`/tasks/${id}`, payload)
        return toCallResult(response.data)
      } catch (error) {
        return toErrorResult(error)
      }
    },
  )

  return server
}

const transports: Record<string, StreamableHTTPServerTransport> = {}
const servers: Record<string, McpServer> = {}

const readJsonBody = async (req: import('node:http').IncomingMessage) => {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk))
  }
  if (!chunks.length) return null
  const raw = Buffer.concat(chunks).toString('utf-8')
  return JSON.parse(raw)
}

const handleMcpRequest = async (
  req: import('node:http').IncomingMessage,
  res: import('node:http').ServerResponse,
) => {
  if (req.method === 'GET') {
    const sessionId = req.headers['mcp-session-id'] as string | undefined
    if (sessionId && transports[sessionId]) {
      await transports[sessionId].handleRequest(req, res)
      return
    }

    res.statusCode = 400
    res.end('Invalid session')
    return
  }

  if (req.method === 'POST') {
    const sessionId = req.headers['mcp-session-id'] as string | undefined
    let body: unknown = null

    try {
      body = await readJsonBody(req)
    } catch {
      res.statusCode = 400
      res.end('Invalid JSON body')
      return
    }

    if (sessionId && transports[sessionId]) {
      await transports[sessionId].handleRequest(req, res, body)
      return
    }

    if (!sessionId && body && isInitializeRequest(body)) {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (id) => {
          transports[id] = transport
        },
      })

      transport.onclose = () => {
        if (transport.sessionId) {
          delete transports[transport.sessionId]
          const server = servers[transport.sessionId]
          delete servers[transport.sessionId]
          void server?.close()
        }
      }

      const server = createMcpServer()
      await server.connect(transport)
      if (transport.sessionId) {
        servers[transport.sessionId] = server
      }
      await transport.handleRequest(req, res, body)
      return
    }

    res.statusCode = 400
    res.end('Invalid session')
    return
  }

  if (req.method === 'DELETE') {
    const sessionId = req.headers['mcp-session-id'] as string | undefined
    if (sessionId && transports[sessionId]) {
      await transports[sessionId].handleRequest(req, res)
      return
    }

    res.statusCode = 400
    res.end('Invalid session')
    return
  }

  res.statusCode = 405
  res.end('Method not allowed')
}

const server = createServer(async (req, res) => {
  const url = req.url ?? '/'
  if (req.method === 'GET' && url === '/healthcheck') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('ok')
    return
  }
  if (url.startsWith('/mcp')) {
    await handleMcpRequest(req, res)
    return
  }

  res.statusCode = 404
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ message: 'Not found' }))
})

const port = Number(process.env.PORT ?? 4100)
server.listen(port, () => {
  console.log(`MCP server listening on http://localhost:${port}`)
})
