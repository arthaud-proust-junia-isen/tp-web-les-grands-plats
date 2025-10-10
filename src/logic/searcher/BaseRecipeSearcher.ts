import { dedupeItems } from '@/logic/array'
import type { Recipe } from '@/logic/Recipe'
import type { RecipeFilters } from '@/logic/RecipeFilters'
import { RecipeMatcher } from '@/logic/RecipeMatcher'
import type { RecipeRepository } from '@/logic/RecipeRepository'
import { CHARS_COUNT_TO_START_QUERY, type IRecipeSearcher } from '@/logic/searcher/RecipeSearcher'

export class BaseRecipeSearcher implements IRecipeSearcher {
  private repository: RecipeRepository

  constructor(repository: RecipeRepository) {
    this.repository = repository
  }

  getResultsFor(filters: RecipeFilters) {
    const recipes = this.getRecipesFor(filters)

    return {
      recipes,
      availableIngredients: this.getAvailableIngredients(filters, recipes),
      availableAppliances: this.getAvailableAppliances(filters, recipes),
      availableUstensils: this.getAvailableUstensils(filters, recipes),
    }
  }

  private getRecipesFor(filters: RecipeFilters): Array<Recipe> {
    return this.repository.filter((recipe) => {
      const match = new RecipeMatcher(recipe)

      if (filters.ingredients.length > 0) {
        const isMatchingAllIngredients = [...filters.ingredients].every((ingredient) =>
          match.byIngredient(ingredient),
        )

        if (!isMatchingAllIngredients) return false
      }

      if (filters.appliances.length > 0) {
        const isMatchingAllAppliances = [...filters.appliances].every((appliance) =>
          match.byAppliance(appliance),
        )

        if (!isMatchingAllAppliances) return false
      }

      if (filters.ustensils.length > 0) {
        const isMatchingAllUstensils = [...filters.ustensils].every((ustensil) =>
          match.byUstensil(ustensil),
        )

        if (!isMatchingAllUstensils) return false
      }

      if (filters.query.length < CHARS_COUNT_TO_START_QUERY) {
        return true
      }

      return new RecipeMatcher(recipe).byQuery(filters.query)
    })
  }

  private getAvailableIngredients(filters: RecipeFilters, recipes: Array<Recipe>): Array<string> {
    return dedupeItems(
      recipes
        .flatMap((recipe) =>
          recipe.ingredients.map((ingredient) => ingredient.ingredient.toLowerCase()),
        )
        .filter((ingredient) => !filters.ingredients.includes(ingredient)),
    )
  }

  private getAvailableAppliances(filters: RecipeFilters, recipes: Array<Recipe>): Array<string> {
    return dedupeItems(
      recipes
        .map((recipe) => recipe.appliance.toLowerCase())
        .filter((appliance) => !filters.appliances.includes(appliance)),
    )
  }

  private getAvailableUstensils(filters: RecipeFilters, recipes: Array<Recipe>): Array<string> {
    return dedupeItems(
      recipes
        .flatMap((recipe) => recipe.ustensils.map((ustensil) => ustensil.toLowerCase()))
        .filter((ustensil) => !filters.ustensils.includes(ustensil)),
    )
  }
}
