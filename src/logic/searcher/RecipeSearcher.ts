import type { Recipe } from '@/logic/Recipe'
import type { RecipeFilters } from '@/logic/RecipeFilters'

export const CHARS_COUNT_TO_START_QUERY = 3

export interface RecipeSearchResults {
  recipes: Array<Recipe>
  availableIngredients: Array<string>
  availableAppliances: Array<string>
  availableUstensils: Array<string>
}

export interface IRecipeSearcher {
  getResultsFor: (filters: RecipeFilters) => RecipeSearchResults
}
