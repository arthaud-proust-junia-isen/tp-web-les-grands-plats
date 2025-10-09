import { RecipeRepository } from '@/js/logic/RecipeRepository'
import { RecipeSearcher } from '@/js/logic/RecipeSearcher'
import { computed, reactive } from 'vue'

export const useRecipeSearcher = async () => {
  const repository = await RecipeRepository.fromExternalJson('/json/recipes.json')

  const searcher = reactive(new RecipeSearcher(repository))

  const query = computed({
    get: () => searcher.query,
    set: (newValue) => (searcher.query = newValue),
  })

  const selectedIngredients = computed({
    get: () => [...searcher.ingredients],
    set: (newValue) => (searcher.ingredients = new Set(newValue)),
  })
  const removeIngredient = (ingredient: string) => searcher.ingredients.delete(ingredient)

  const selectedAppliances = computed({
    get: () => [...searcher.appliances],
    set: (newValue) => (searcher.appliances = new Set(newValue)),
  })
  const removeAppliance = (appliance: string) => searcher.appliances.delete(appliance)

  const selectedUstensils = computed({
    get: () => [...searcher.ustensils],
    set: (newValue) => (searcher.ustensils = new Set(newValue)),
  })
  const removeUstensil = (ustensil: string) => searcher.ustensils.delete(ustensil)

  const availableIngredients = computed(() => searcher.getAvailableIngredients())
  const availableAppliances = computed(() => searcher.getAvailableAppliances())
  const availableUstensils = computed(() => searcher.getAvailableUstensils())
  const recipes = computed(() => searcher.getResults())

  return {
    searcher,

    query,
    selectedIngredients,
    selectedAppliances,
    selectedUstensils,

    removeIngredient,
    removeAppliance,
    removeUstensil,

    availableIngredients,
    availableAppliances,
    availableUstensils,
    recipes,
  }
}
