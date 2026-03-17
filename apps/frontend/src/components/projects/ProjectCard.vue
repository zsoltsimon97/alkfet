<template>
  <v-card
    class="project-card"
    rounded="lg"
    variant="elevated"
    @click="emitOpen"
  >
    <v-card-item>
      <v-card-title class="text-h6">{{ project.name }}</v-card-title>
      <v-card-subtitle class="text-medium-emphasis">
        {{ project.description || 'Még nincs leírás.' }}
      </v-card-subtitle>
      <template #append>
        <v-chip
          size="small"
          :color="project.status === 'active' ? 'success' : 'grey'"
          variant="tonal"
        >
          {{ statusLabel(project.status) }}
        </v-chip>
      </template>
    </v-card-item>
    <v-card-text class="text-caption text-medium-emphasis">
      Frissítve: {{ formatDate(project.updatedAt) }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Project, ProjectStatus } from '@/types'

  const props = defineProps<{
    project: Project
    statusOptions: Array<{ title: string; value: ProjectStatus }>
  }>()

  const emit = defineEmits<{
    (event: 'open', id: number): void
  }>()

  const statusLabel = (status: ProjectStatus) =>
    props.statusOptions.find((option) => option.value === status)?.title ?? status

  const formatDate = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.valueOf())) return 'nemrég'
    return date.toLocaleDateString()
  }

  const emitOpen = () => {
    emit('open', props.project.id)
  }
</script>

<style scoped>

</style>
