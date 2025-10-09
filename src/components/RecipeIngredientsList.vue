<template>
  <section class="rounded-xl px-4 py-2 bg-neutral-100">
    <h3 class="text-2xl">Ingrédients</h3>
    <ul class="list-disc list-inside">
      <li v-for="ingredient in ingredients" :key="ingredient.ingredient" class="space-x-1">
        <span>{{ ingredient.ingredient }}</span>
        <span v-if="ingredient.quantity">: {{ ingredient.quantity }}</span>
        <span v-if="ingredient.unit">{{ ingredient.unit }}</span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { Ingredient } from '@/js/logic/Recipe'
defineProps<{
  ingredients: Array<Ingredient>
}>()
</script>
