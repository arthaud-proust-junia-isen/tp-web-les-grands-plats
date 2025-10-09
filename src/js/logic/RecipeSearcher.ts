import type { Recipe } from './Recipe'
import { RecipeMatcher } from './RecipeMatcher'
import type { RecipeRepository } from './RecipeRepository'

const CHARS_COUNT_TO_START_QUERY = 3

const dedupeItems = <T>(items: Array<T>) => Array.from(new Set(items))

export class RecipeSearcher {
  ingredients: Set<string> = new Set()
  appliances: Set<string> = new Set()
  ustensils: Set<string> = new Set()
  query: string = ''

  private repository: RecipeRepository

  constructor(repository: RecipeRepository) {
    this.repository = repository
  }

  getResults(): Array<Recipe> {
    return this.repository.getRecipes((recipe) => {
      const match = new RecipeMatcher(recipe)

      if (this.ingredients.size > 0) {
        const isMatchingAllIngredients = [...this.ingredients].every((ingredient) =>
          match.byIngredient(ingredient),
        )

        if (!isMatchingAllIngredients) return false
      }

      if (this.appliances.size > 0) {
        const isMatchingAllAppliances = [...this.appliances].every((appliance) =>
          match.byAppliance(appliance),
        )

        if (!isMatchingAllAppliances) return false
      }

      if (this.ustensils.size > 0) {
        const isMatchingAllUstensils = [...this.ustensils].every((ustensil) =>
          match.byUstensil(ustensil),
        )

        if (!isMatchingAllUstensils) return false
      }

      if (this.query.length < CHARS_COUNT_TO_START_QUERY) {
        return true
      }

      return new RecipeMatcher(recipe).byQuery(this.query)
    })
  }

  getAvailableIngredients(): Array<string> {
    return dedupeItems(
      this.getResults()
        .flatMap((result) =>
          result.ingredients.map((ingredient) => ingredient.ingredient.toLowerCase()),
        )
        .filter((ingredient) => !this.ingredients.has(ingredient)),
    )
  }

  getAvailableAppliances(): Array<string> {
    return dedupeItems(
      this.getResults()
        .map((result) => result.appliance.toLowerCase())
        .filter((appliance) => !this.appliances.has(appliance)),
    )
  }

  getAvailableUstensils(): Array<string> {
    return dedupeItems(
      this.getResults()
        .flatMap((result) => result.ustensils.map((ustensil) => ustensil.toLowerCase()))
        .filter((ustensil) => !this.ustensils.has(ustensil)),
    )
  }
}
