import { http } from './http'
import type { Task, TaskPriority, TaskStatus } from '@/types'

export type TaskPayload = {
  projectId: number
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
}

export const listTasks = async (projectId: number): Promise<Task[]> => {
  const response = await http.get<Task[]>('/tasks', { params: { projectId } })
  return response.data
}

export const createTask = async (payload: TaskPayload): Promise<Task> => {
  const response = await http.post<Task>('/tasks', payload)
  return response.data
}

export const updateTask = async (id: number, payload: TaskPayload): Promise<Task> => {
  const response = await http.patch<Task>(`/tasks/${id}`, payload)
  return response.data
}
