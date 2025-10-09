<template>
  <article class="border border-neutral-200 rounded-lg p-2 relative">
    <header>
      <h2 class="text-2xl">{{ recipe.name }} <RecipeTime :time="recipe.time" /></h2>
    </header>

    <p>
      {{ recipe.description.slice(0, 120) + '...' }}
      <button @click="isModalOpen = true" class="inline font-bold fluid-link">Voir plus</button>
    </p>

    <Modal v-model="isModalOpen">
      <header>
        <h2 class="text-4xl">{{ recipe.name }} <RecipeTime :time="recipe.time" /></h2>
      </header>

      <RecipeIngredientsList class="mt-4" :ingredients="recipe.ingredients" />

      <section class="mt-4">
        <h3 class="text-2xl">Recette</h3>
        <p class="mt-1 whitespace-pre-wrap">{{ recipe.description.replace(/\. /gm, '.\n') }}</p>
      </section>
    </Modal>
  </article>
</template>

<script setup lang="ts">
import Modal from '@/components/Modal.vue'
import { ref } from 'vue'

import RecipeIngredientsList from '@/components/RecipeIngredientsList.vue'
import RecipeTime from '@/components/RecipeTime.vue'
import type { Recipe } from '@/logic/Recipe'

defineProps<{
  recipe: Recipe
}>()

const isModalOpen = ref(false)
</script>
