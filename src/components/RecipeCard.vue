<template>
  <article class="border border-neutral-200 rounded-lg p-2 relative">
    <header>
      <h2 class="text-2xl">{{ recipe.name }}</h2>
      <span class="flex items-center gap-0.5 mt-0.5">
        <ClockIcon class="size-5" />
        <span>{{ recipe.time }}</span>
      </span>
    </header>

    <p>
      {{ recipe.description.slice(0, 120) + '...' }}
      <button @click="isModalOpen = true" class="inline font-bold fluid-link">Voir plus</button>
    </p>

    <Modal v-model="isModalOpen">
      <header>
        <h2 class="text-4xl">{{ recipe.name }}</h2>
        <span class="flex items-center gap-0.5 mt-0.5">
          <ClockIcon class="size-5" />
          <span>{{ recipe.time }}</span>
        </span>
      </header>

      <section class="mt-2">
        <RecipeIngredientsList :ingredients="recipe.ingredients" />
        <h3 class="text-2xl mt-4">Recette</h3>
        <p class="mt-2 whitespace-pre-wrap">{{ recipe.description.replace(/\. /gm, '.\n') }}</p>
      </section>
    </Modal>
  </article>
</template>

<script setup lang="ts">
import Modal from '@/components/Modal.vue'
import { ClockIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import RecipeIngredientsList from '@/components/RecipeIngredientsList.vue'
import type { Recipe } from '@/js/logic/Recipe'

defineProps<{
  recipe: Recipe
}>()

const isModalOpen = ref(false)
</script>
