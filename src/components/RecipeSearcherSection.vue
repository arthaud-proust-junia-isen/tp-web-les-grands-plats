<template>
  <section class="flex flex-col gap-2">
    <header class="sticky top-0 z-10 bg-white py-2">
      <form role="search" autocomplete="off">
        <label class="flex gap-2">
          <input
            v-model="searcher.query.value"
            class="w-full py-3 px-3 bg-gray-100 rounded-lg"
            type="text"
            placeholder="Rechercher un ingrédient, appareil, ustensiles ou une recette"
          />
        </label>
      </form>

      <div class="mt-2 flex gap-2">
        <TagSelector
          class="flex-1"
          :options="searcher.availableIngredients.value"
          v-model="searcher.selectedIngredients.value"
          :disabled="!searcher.availableIngredients.value.length"
          placeholder="Rechercher un ingrédient"
          type="ingredient"
        />

        <TagSelector
          class="flex-1"
          :options="searcher.availableAppliances.value"
          v-model="searcher.selectedAppliances.value"
          :disabled="!searcher.availableAppliances.value.length"
          placeholder="Rechercher un appareil"
          type="appliance"
        />

        <TagSelector
          class="flex-1"
          :options="searcher.availableUstensils.value"
          v-model="searcher.selectedUstensils.value"
          :disabled="!searcher.availableUstensils.value.length"
          placeholder="Rechercher un ustensile"
          type="ustensil"
        />
      </div>

      <section class="mt-4 flex gap-2">
        <SearchItem
          v-for="ingredient in searcher.selectedIngredients.value"
          :key="ingredient"
          :name="ingredient"
          type="ingredient"
          @click="searcher.removeIngredient(ingredient)"
        />

        <SearchItem
          v-for="appliance in searcher.selectedAppliances.value"
          :key="appliance"
          :name="appliance"
          type="appliance"
          @click="searcher.removeAppliance(appliance)"
        />

        <SearchItem
          v-for="ustensil in searcher.selectedUstensils.value"
          :key="ustensil"
          :name="ustensil"
          type="ustensil"
          @click="searcher.removeUstensil(ustensil)"
        />
      </section>
    </header>

    <section class="pt-12 pb-20 grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <RecipeCard v-for="recipe in searcher.recipes.value" :key="recipe.id" :recipe="recipe" />
    </section>
  </section>
</template>

<script setup lang="ts">
import RecipeCard from '@/components/RecipeCard.vue'
import SearchItem from '@/components/SearchItem.vue'
import TagSelector from '@/components/TagSelector.vue'
import { useRecipeSearcher } from '@/composables/useRecipeSearcher'

const searcher = await useRecipeSearcher()
</script>
