<template>
  <v-container class="py-8" max-width="1200">
    <ProjectDetailsHeader @create-task="openCreateTask" />

    <v-alert v-if="errorMessage" class="mb-6" type="error" variant="tonal">
      {{ errorMessage }}
    </v-alert>

    <v-row>
      <v-col cols="12" md="4">
        <ProjectDetailsForm
          :project="projectState"
          :status-options="projectStatusOptions"
          :loading="projectSaving"
          @submit="saveProject"
        />
      </v-col>
      <v-col cols="12" md="8">
        <TasksTable :tasks="tasks" :loading="taskLoading" @edit="openEditTask" />
      </v-col>
    </v-row>
  </v-container>
  <TaskDialog
    v-model="taskDialog"
    :loading="taskSaving"
    :task="taskEditing"
    :status-options="taskStatusOptions"
    :priority-options="taskPriorityOptions"
    @submit="saveTask"
  />
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import ProjectDetailsForm from '@/components/project-details/ProjectDetailsForm.vue'
  import ProjectDetailsHeader from '@/components/project-details/ProjectDetailsHeader.vue'
  import TaskDialog from '@/components/project-details/TaskDialog.vue'
  import TasksTable from '@/components/project-details/TasksTable.vue'
  import { getProject, updateProject } from '@/api/projects'
  import { createTask, listTasks, updateTask } from '@/api/tasks'
  import { normalizeError } from '@/api/http'
  import type { ProjectStatus, Task, TaskPriority, TaskStatus } from '@/types'

  const route = useRoute()

  const projectId = computed(() => Number(route.params.id))

  const errorMessage = ref('')

  const projectSaving = ref(false)
  const projectState = reactive({
    name: '',
    description: '',
    status: 'active' as ProjectStatus,
  })

  const taskLoading = ref(true)
  const taskSaving = ref(false)
  const taskDialog = ref(false)
  const taskEditing = ref<Task | null>(null)
  const tasks = ref<Task[]>([])

  const projectStatusOptions: Array<{ title: string; value: ProjectStatus }> = [
    { title: 'Aktív', value: 'active' },
    { title: 'Archivált', value: 'archived' },
  ]

  const taskStatusOptions: Array<{ title: string; value: TaskStatus }> = [
    { title: 'Teendő', value: 'todo' },
    { title: 'Folyamatban', value: 'in_progress' },
    { title: 'Kész', value: 'done' },
  ]

  const taskPriorityOptions: Array<{ title: string; value: TaskPriority }> = [
    { title: 'Alacsony', value: 'low' },
    { title: 'Közepes', value: 'medium' },
    { title: 'Magas', value: 'high' },
  ]

  const loadProject = async () => {
    if (!projectId.value) return
    try {
      const project = await getProject(projectId.value)
      projectState.name = project.name
      projectState.description = project.description ?? ''
      projectState.status = project.status
    } catch (error) {
      errorMessage.value = normalizeError(error).message
    }
  }

  const loadTasks = async () => {
    if (!projectId.value) return
    taskLoading.value = true
    try {
      tasks.value = await listTasks(projectId.value)
    } catch (error) {
      errorMessage.value = normalizeError(error).message
    } finally {
      taskLoading.value = false
    }
  }

  const saveProject = async (payload: {
    name: string
    description?: string
    status: ProjectStatus
  }) => {
    if (!projectId.value) return
    projectSaving.value = true
    errorMessage.value = ''
    try {
      await updateProject(projectId.value, payload)
    } catch (error) {
      errorMessage.value = normalizeError(error).message
    } finally {
      projectSaving.value = false
    }
  }

  const openCreateTask = () => {
    taskEditing.value = null
    taskDialog.value = true
  }

  const openEditTask = (task: Task) => {
    taskEditing.value = task
    taskDialog.value = true
  }

  const saveTask = async (payload: {
    title: string
    description?: string
    status: TaskStatus
    priority: TaskPriority
    dueDate?: string
  }) => {
    if (!projectId.value) return
    taskSaving.value = true
    errorMessage.value = ''
    try {
      if (taskEditing.value) {
        await updateTask(taskEditing.value.id, {
          projectId: projectId.value,
          ...payload,
        })
      } else {
        await createTask({
          projectId: projectId.value,
          ...payload,
        })
      }
      taskDialog.value = false
      await loadTasks()
    } catch (error) {
      errorMessage.value = normalizeError(error).message
    } finally {
      taskSaving.value = false
    }
  }

  onMounted(async () => {
    await loadProject()
    await loadTasks()
  })
</script>
