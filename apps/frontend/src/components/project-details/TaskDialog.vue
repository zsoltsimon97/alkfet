<template>
  <v-dialog v-model="dialogOpen" max-width="600">
    <v-card>
      <v-card-title class="text-h6">
        {{ isEditing ? 'Feladat szerkesztése' : 'Új feladat' }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="state.title"
            label="Cím"
            :rules="[rules.required]"
            variant="outlined"
            density="comfortable"
          />
          <v-textarea
            v-model="state.description"
            label="Leírás"
            rows="3"
            variant="outlined"
            density="comfortable"
          />
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="state.status"
                :items="statusOptions"
                label="Állapot"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="state.priority"
                :items="priorityOptions"
                label="Prioritás"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="state.dueDate"
            label="Határidő"
            type="date"
            variant="outlined"
            density="comfortable"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="closeDialog">Mégse</v-btn>
        <v-btn color="primary" :loading="loading" @click="submit">
          {{ isEditing ? 'Mentés' : 'Létrehozás' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref, watch } from 'vue'
  import type { Task, TaskPriority, TaskStatus } from '@/types'

  const props = defineProps<{
    modelValue: boolean
    loading: boolean
    task: Task | null
    statusOptions: Array<{ title: string; value: TaskStatus }>
    priorityOptions: Array<{ title: string; value: TaskPriority }>
  }>()

  const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void
    (event: 'submit', payload: {
      title: string
      description?: string
      status: TaskStatus
      priority: TaskPriority
      dueDate?: string
    }): void
  }>()

  const form = ref()
  const valid = ref(false)
  const state = reactive({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    dueDate: '',
  })

  const rules = {
    required: (value: string) => !!value || 'Kötelező',
  }

  const dialogOpen = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value),
  })

  const isEditing = computed(() => !!props.task)

  const toDateInput = (value?: string | null) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.valueOf())) return ''
    return date.toISOString().slice(0, 10)
  }

  const resetState = () => {
    state.title = props.task?.title ?? ''
    state.description = props.task?.description ?? ''
    state.status = props.task?.status ?? 'todo'
    state.priority = props.task?.priority ?? 'medium'
    state.dueDate = props.task ? toDateInput(props.task.dueDate) : ''
    form.value?.resetValidation()
  }

  const closeDialog = () => {
    dialogOpen.value = false
  }

  const submit = async () => {
    const result = await form.value?.validate()
    if (!result?.valid) return

    emit('submit', {
      title: state.title,
      description: state.description || undefined,
      status: state.status,
      priority: state.priority,
      dueDate: state.dueDate || undefined,
    })
  }

  watch(
    () => props.modelValue,
    (value) => {
      if (value) {
        resetState()
      }
    },
  )

  watch(
    () => props.task,
    () => {
      if (props.modelValue) {
        resetState()
      }
    },
  )
</script>
