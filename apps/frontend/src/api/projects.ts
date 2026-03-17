import { http } from './http'
import type { Project, ProjectStatus } from '@/types'

export type ProjectPayload = {
  name: string
  description?: string
  status?: ProjectStatus
}

export const listProjects = async (): Promise<Project[]> => {
  const response = await http.get<Project[]>('/projects')
  return response.data
}

export const getProject = async (id: number): Promise<Project> => {
  const response = await http.get<Project>(`/projects/${id}`)
  return response.data
}

export const createProject = async (payload: ProjectPayload): Promise<Project> => {
  const response = await http.post<Project>('/projects', payload)
  return response.data
}

export const updateProject = async (id: number, payload: ProjectPayload): Promise<Project> => {
  const response = await http.patch<Project>(`/projects/${id}`, payload)
  return response.data
}
