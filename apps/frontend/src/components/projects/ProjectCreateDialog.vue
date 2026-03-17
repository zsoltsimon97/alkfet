<template>
  <v-dialog v-model="dialogOpen" max-width="520">
    <v-card>
      <v-card-title class="text-h6">Új projekt</v-card-title>
      <v-card-text>
        <v-form ref="createForm" v-model="valid">
          <v-text-field
            v-model="state.name"
            label="Projekt neve"
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
        <v-btn variant="text" @click="closeDialog">Mégse</v-btn>
        <v-btn color="primary" :loading="loading" @click="submit">
          Létrehozás
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref, watch } from 'vue'
  import type { ProjectStatus } from '@/types'

  const props = defineProps<{
    modelValue: boolean
    loading: boolean
    statusOptions: Array<{ title: string; value: ProjectStatus }>
  }>()

  const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void
    (event: 'submit', payload: { name: string; description?: string; status: ProjectStatus }): void
  }>()

  const createForm = ref()
  const valid = ref(false)
  const state = reactive({
    name: '',
    description: '',
    status: 'active' as ProjectStatus,
  })

  const rules = {
    required: (value: string) => !!value || 'Kötelező',
  }

  const dialogOpen = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value),
  })

  const resetForm = () => {
    state.name = ''
    state.description = ''
    state.status = 'active'
    createForm.value?.reset()
  }

  const closeDialog = () => {
    dialogOpen.value = false
    resetForm()
  }

  const submit = async () => {
    const result = await createForm.value?.validate()
    if (!result?.valid) return

    emit('submit', {
      name: state.name,
      description: state.description || undefined,
      status: state.status,
    })
  }

  watch(
    () => props.modelValue,
    (value) => {
      if (!value) {
        resetForm()
      }
    },
  )
</script>
