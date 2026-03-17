import { serve } from '@hono/node-server'
import { Hono, type Context } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import axios, { AxiosError } from 'axios'

const app = new Hono()

app.use('*', logger())
app.use('*', cors())

const backendBase = process.env.BACKEND_URL ?? 'http://localhost:3000'
const backendUrl = new URL(backendBase)
const backendPath = backendUrl.pathname.replace(/\/$/, '')

const client = axios.create({
  baseURL: backendUrl.toString(),
})

const forward = async (c: Context) => {
  const requestUrl = new URL(c.req.url)
  const path = `${backendPath}${c.req.path}`
  const method = c.req.method.toLowerCase() as
    | 'get'
    | 'post'
    | 'patch'
    | 'delete'
    | 'put'
    | 'options'

  const headers = {
    ...c.req.header(),
  }

  let data: unknown = undefined
  if (!['get', 'delete', 'options'].includes(method)) {
    const contentType = c.req.header('content-type') ?? ''
    if (contentType.includes('application/json')) {
      data = await c.req.json()
    } else if (contentType) {
      data = await c.req.text()
    }
  }

  try {
    const response = await client.request({
      url: path,
      method,
      params: Object.fromEntries(requestUrl.searchParams.entries()),
      data,
      headers,
      validateStatus: () => true,
    })

    return c.json(response.data, response.status)
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    if (axiosError.response) {
      return c.json(axiosError.response.data, axiosError.response.status)
    }

    return c.json({ message: axiosError.message ?? 'Gateway error' }, 502)
  }
}

app.all('/projects', forward)
app.all('/projects/:id', forward)
app.all('/tasks', forward)
app.all('/tasks/:id', forward)

const port = Number(process.env.PORT ?? 4000)
serve({ fetch: app.fetch, port })

console.log(`API Gateway listening on http://localhost:${port}`)
