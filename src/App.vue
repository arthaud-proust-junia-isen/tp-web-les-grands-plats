<template>
  <header class="p-4">
    <a href="/" class="flex flex-col items-center">
      <img alt="" src="/img/logo.svg" />
      <h1 class="text-lg">Les grands plats</h1>
    </a>
  </header>

  <main class="max-w-4xl mx-auto">
    <Suspense>
      <RecipeSearcherSection />
    </Suspense>
  </main>
</template>

<script setup lang="ts">
import RecipeSearcherSection from '@/components/RecipeSearcherSection.vue'
</script>
