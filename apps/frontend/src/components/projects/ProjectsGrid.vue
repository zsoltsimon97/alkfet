<template>
  <v-row v-if="loading">
    <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
      <v-card class="pa-4" rounded="lg" variant="outlined">
        <v-skeleton-loader type="heading, paragraph, actions" />
      </v-card>
    </v-col>
  </v-row>

  <v-row v-else-if="projects.length">
    <v-col v-for="project in projects" :key="project.id" cols="12" sm="6" md="4">
      <ProjectCard :project="project" :status-options="statusOptions" @open="emitOpen" />
    </v-col>
  </v-row>

  <v-empty-state
    v-else
    icon="mdi-folder-outline"
    title="Még nincs projekt"
    text="Hozd létre az első projektedet a feladatok követéséhez."
  >
    <template #actions>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="emitCreate">
        Új projekt
      </v-btn>
    </template>
  </v-empty-state>
</template>

<script lang="ts" setup>
  import ProjectCard from '@/components/projects/ProjectCard.vue'
  import type { Project, ProjectStatus } from '@/types'

  const props = defineProps<{
    projects: Project[]
    loading: boolean
    statusOptions: Array<{ title: string; value: ProjectStatus }>
  }>()

  const emit = defineEmits<{
    (event: 'open', id: number): void
    (event: 'create'): void
  }>()

  const emitOpen = (id: number) => {
    emit('open', id)
  }

  const emitCreate = () => {
    emit('create')
  }
</script>
