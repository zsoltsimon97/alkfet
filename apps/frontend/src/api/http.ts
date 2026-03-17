import axios, { AxiosError } from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000'

export const http = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

export type ApiError = {
  message: string
  status?: number
}

export const normalizeError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>
    return {
      message: axiosError.response?.data?.message ?? axiosError.message,
      status: axiosError.response?.status,
    }
  }

  return {
    message: error instanceof Error ? error.message : 'Unexpected error',
  }
}
