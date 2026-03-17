<template>
  <v-row class="align-center mb-6">
    <v-col cols="12" md="8">
      <div class="text-h4 font-weight-semibold">{{ title }}</div>
    </v-col>
    <v-col cols="12" md="4" class="text-md-right">
      <v-btn color="primary" prepend-icon="mdi-plus" @click="emitCreate">
        {{ buttonText }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  const props = withDefaults(
    defineProps<{
      title?: string
      buttonText?: string
    }>(),
    {
      title: 'Projektek',
      buttonText: 'Új projekt',
    },
  )

  const emit = defineEmits<{
    (event: 'create'): void
  }>()

  const emitCreate = () => {
    emit('create')
  }
</script>
