import { RecipeRepository } from '@/logic/RecipeRepository'
import { BaseRecipeSearcher } from '@/logic/searcher/BaseRecipeSearcher'
import type { IRecipeSearcher } from '@/logic/searcher/RecipeSearcher'
import { computed, ref, type Ref } from 'vue'

const makeRemoveFnFrom =
  <T>(refArray: Ref<Array<T>>) =>
  (itemToRemove: T) =>
    refArray.value.splice(refArray.value.indexOf(itemToRemove), 1)

export const useRecipeSearcher = async () => {
  const repository = await RecipeRepository.fromExternalJson('/json/recipes.json')

  const searcher: IRecipeSearcher = new BaseRecipeSearcher(repository)

  const query = ref('')

  const selectedIngredients = ref([] as Array<string>)
  const selectedAppliances = ref([] as Array<string>)
  const selectedUstensils = ref([] as Array<string>)

  const removeIngredient = makeRemoveFnFrom(selectedIngredients)
  const removeAppliance = makeRemoveFnFrom(selectedAppliances)
  const removeUstensil = makeRemoveFnFrom(selectedUstensils)

  const results = computed(() =>
    searcher.getResultsFor({
      query: query.value,
      ingredients: selectedIngredients.value,
      appliances: selectedAppliances.value,
      ustensils: selectedUstensils.value,
    }),
  )

  return {
    searcher,

    query,
    selectedIngredients,
    selectedAppliances,
    selectedUstensils,

    removeIngredient,
    removeAppliance,
    removeUstensil,

    results,
  }
}
