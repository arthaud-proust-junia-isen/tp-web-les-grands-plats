<template>
  <section class="flex flex-col gap-2">
    <header class="sticky top-0 z-10 bg-white py-2">
      <form role="search" autocomplete="off">
        <label class="flex gap-2">
          <input
            v-model="query"
            class="w-full py-3 px-3 bg-gray-100 rounded-lg"
            type="text"
            placeholder="Rechercher un ingrédient, appareil, ustensiles ou une recette"
          />
        </label>
      </form>

      <div class="mt-2 flex gap-2">
        <TagSelector
          class="flex-1"
          :options="results.availableIngredients"
          v-model="selectedIngredients"
          :disabled="!results.availableIngredients.length"
          placeholder="Rechercher un ingrédient"
          type="ingredient"
        />

        <TagSelector
          class="flex-1"
          :options="results.availableAppliances"
          v-model="selectedAppliances"
          :disabled="!results.availableAppliances.length"
          placeholder="Rechercher un appareil"
          type="appliance"
        />

        <TagSelector
          class="flex-1"
          :options="results.availableUstensils"
          v-model="selectedUstensils"
          :disabled="!results.availableUstensils.length"
          placeholder="Rechercher un ustensile"
          type="ustensil"
        />
      </div>

      <section class="mt-4 flex gap-2">
        <SearchItem
          v-for="ingredient in selectedIngredients"
          :key="ingredient"
          :name="ingredient"
          type="ingredient"
          @click="removeIngredient(ingredient)"
        />

        <SearchItem
          v-for="appliance in selectedAppliances"
          :key="appliance"
          :name="appliance"
          type="appliance"
          @click="removeAppliance(appliance)"
        />

        <SearchItem
          v-for="ustensil in selectedUstensils"
          :key="ustensil"
          :name="ustensil"
          type="ustensil"
          @click="removeUstensil(ustensil)"
        />
      </section>
    </header>

    <section class="pt-12 pb-20 grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <RecipeCard v-for="recipe in results.recipes" :key="recipe.id" :recipe="recipe" />
    </section>
  </section>
</template>

<script setup lang="ts">
import RecipeCard from '@/components/RecipeCard.vue'
import SearchItem from '@/components/SearchItem.vue'
import TagSelector from '@/components/TagSelector.vue'
import { useRecipeSearcher } from '@/composables/useRecipeSearcher'

const {
  query,
  selectedAppliances,
  selectedIngredients,
  selectedUstensils,

  removeAppliance,
  removeIngredient,
  removeUstensil,

  results,
} = await useRecipeSearcher()
</script>
