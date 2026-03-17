<template>
  <v-container class="py-8" max-width="1200">
    <ProjectsHeader @create="openCreate" />

    <v-alert v-if="errorMessage" class="mb-6" type="error" variant="tonal">
      {{ errorMessage }}
    </v-alert>

    <ProjectsGrid
      :projects="projects"
      :loading="loading"
      :status-options="statusOptions"
      @open="openProject"
      @create="openCreate"
    />
  </v-container>
  <ProjectCreateDialog
    v-model="createDialog"
    :loading="createLoading"
    :status-options="statusOptions"
    @submit="submitCreate"
  />
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import ProjectCreateDialog from '@/components/projects/ProjectCreateDialog.vue'
  import ProjectsGrid from '@/components/projects/ProjectsGrid.vue'
  import ProjectsHeader from '@/components/projects/ProjectsHeader.vue'
  import { createProject, listProjects } from '@/api/projects'
  import { normalizeError } from '@/api/http'
  import type { Project, ProjectStatus } from '@/types'

  const router = useRouter()

  const projects = ref<Project[]>([])
  const loading = ref(true)
  const errorMessage = ref('')

  const createDialog = ref(false)
  const createLoading = ref(false)

  const statusOptions = [
    { title: 'Aktív', value: 'active' },
    { title: 'Archivált', value: 'archived' },
  ]

  const fetchProjects = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
      projects.value = await listProjects()
    } catch (error) {
      errorMessage.value = normalizeError(error).message
    } finally {
      loading.value = false
    }
  }

  const openProject = (id: number) => {
    router.push(`/projects/${id}`)
  }

  const openCreate = () => {
    createDialog.value = true
  }

  const submitCreate = async (payload: {
    name: string
    description?: string
    status: ProjectStatus
  }) => {
    createLoading.value = true
    errorMessage.value = ''
    try {
      await createProject(payload)
      createDialog.value = false
      await fetchProjects()
    } catch (error) {
      errorMessage.value = normalizeError(error).message
    } finally {
      createLoading.value = false
    }
  }

  onMounted(fetchProjects)
</script>
