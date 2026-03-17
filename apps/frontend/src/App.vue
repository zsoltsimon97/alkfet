<template>
  <v-app>
    <v-app-bar flat density="comfortable" class="app-bar">
      <v-app-bar-title class="text-h6 font-weight-medium">
        Feladatkezelő
      </v-app-bar-title>
      <v-spacer />
      <v-btn variant="text" prepend-icon="mdi-view-grid" @click="goHome">Projektek</v-btn>
    </v-app-bar>
    <v-main class="app-shell">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const goHome = () => {
    if (router.currentRoute.value.path !== '/') {
      router.push('/')
    }
  }
</script>

<style scoped>
  .app-shell {
    min-height: 100vh;
    background:
      radial-gradient(circle at top left, rgba(232, 246, 241, 0.7), transparent 55%),
      radial-gradient(circle at 20% 20%, rgba(250, 243, 230, 0.7), transparent 60%),
      linear-gradient(160deg, #f8f6f0 0%, #f1f7f6 60%, #eef3f5 100%);
  }

  .app-bar {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
  }
</style>
