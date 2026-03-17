<template>
  <v-card rounded="lg" variant="elevated">
    <v-card-title class="text-h6">Projekt adatai</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="state.name"
          label="Név"
          :rules="[rules.required]"
          variant="outlined"
          density="comfortable"
        />
        <v-textarea
          v-model="state.description"
          label="Leírás"
          rows="4"
          variant="outlined"
          density="comfortable"
        />
        <v-select
          v-model="state.status"
          :items="statusOptions"
          label="Állapot"
          variant="outlined"
          density="comfortable"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" :loading="loading" @click="submit">
        Mentés
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue'
  import type { ProjectStatus } from '@/types'

  const props = defineProps<{
    project: {
      name: string
      description: string
      status: ProjectStatus
    }
    statusOptions: Array<{ title: string; value: ProjectStatus }>
    loading: boolean
  }>()

  const emit = defineEmits<{
    (event: 'submit', payload: { name: string; description?: string; status: ProjectStatus }): void
  }>()

  const form = ref()
  const valid = ref(false)
  const state = reactive({
    name: props.project.name,
    description: props.project.description,
    status: props.project.status,
  })

  const rules = {
    required: (value: string) => !!value || 'Kötelező',
  }

  const submit = async () => {
    const result = await form.value?.validate()
    if (!result?.valid) return

    emit('submit', {
      name: state.name,
      description: state.description || undefined,
      status: state.status,
    })
  }

  watch(
    () => props.project,
    (project) => {
      state.name = project.name
      state.description = project.description
      state.status = project.status
    },
    { deep: true },
  )
</script>
