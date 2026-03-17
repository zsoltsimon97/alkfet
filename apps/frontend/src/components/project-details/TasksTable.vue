<template>
  <v-card rounded="lg" variant="elevated">
    <v-card-title class="d-flex align-center">
      <span class="text-h6">Feladatok</span>
      <v-spacer />
      <v-text-field
        v-model="search"
        append-inner-icon="mdi-magnify"
        label="Keresés"
        single-line
        hide-details
        density="compact"
        style="max-width: 260px"
      />
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="tasks"
      :loading="loading"
      :search="search"
      item-value="id"
      class="px-2"
    >
      <template #item.status="{ item }">
        <v-chip size="small" :color="statusColor(item.status)" variant="tonal">
          {{ taskStatusLabel(item.status) }}
        </v-chip>
      </template>
      <template #item.priority="{ item }">
        <v-chip size="small" :color="priorityColor(item.priority)" variant="tonal">
          {{ taskPriorityLabel(item.priority) }}
        </v-chip>
      </template>
      <template #item.dueDate="{ item }">
        {{ item.dueDate ? formatDate(item.dueDate) : '—' }}
      </template>
      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil" size="small" variant="text" @click="emitEdit(item)" />
      </template>
      <template #loading>
        <v-skeleton-loader type="table-row@5" />
      </template>
      <template #no-data>
        <v-empty-state
          icon="mdi-clipboard-text-outline"
          title="Nincs feladat"
          text="Hozz létre egy feladatot az induláshoz."
        />
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import type { Task, TaskPriority, TaskStatus } from '@/types'

  defineProps<{
    tasks: Task[]
    loading: boolean
  }>()

  const emit = defineEmits<{
    (event: 'edit', task: Task): void
  }>()

  const search = ref('')

  const headers: Array<{
    title: string
    key: string
    align?: 'start' | 'end' | 'center'
    sortable?: boolean
  }> = [
    { title: 'Cím', key: 'title', align: 'start' },
    { title: 'Állapot', key: 'status' },
    { title: 'Prioritás', key: 'priority' },
    { title: 'Határidő', key: 'dueDate' },
    { title: 'Műveletek', key: 'actions', sortable: false, align: 'end' },
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

  const taskStatusLabel = (status: TaskStatus) =>
    taskStatusOptions.find((option) => option.value === status)?.title ?? status

  const taskPriorityLabel = (priority: TaskPriority) =>
    taskPriorityOptions.find((option) => option.value === priority)?.title ?? priority

  const statusColor = (status: TaskStatus) => {
    if (status === 'done') return 'success'
    if (status === 'in_progress') return 'warning'
    return 'primary'
  }

  const priorityColor = (priority: TaskPriority) => {
    if (priority === 'high') return 'error'
    if (priority === 'medium') return 'warning'
    return 'secondary'
  }

  const formatDate = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.valueOf())) return '—'
    return date.toLocaleDateString()
  }

  const emitEdit = (task: Task) => {
    emit('edit', task)
  }
</script>
