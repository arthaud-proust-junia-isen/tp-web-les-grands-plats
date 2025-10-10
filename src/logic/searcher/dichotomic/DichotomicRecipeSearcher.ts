import type { Recipe, RecipeId } from '@/logic/Recipe'
import type { RecipeFilters } from '@/logic/RecipeFilters'
import { RecipeMatcher } from '@/logic/RecipeMatcher'
import type { RecipeRepository } from '@/logic/RecipeRepository'
import { Keyword } from '@/logic/searcher/dichotomic/Keyword'
import { RecipeIndexer, type RelevantKeywords } from '@/logic/searcher/dichotomic/RecipeIndexer'
import { type IRecipeSearcher } from '@/logic/searcher/RecipeSearcher'

const dedupeItems = <T>(items: Array<T>) => Array.from(new Set(items))

export class DichotomicRecipeSearcher implements IRecipeSearcher {
  private repository: RecipeRepository

  private relevantKeywords: RelevantKeywords = []

  constructor(repository: RecipeRepository) {
    this.repository = repository

    this.relevantKeywords = this.getRelevantKeywords()
  }

  private getRelevantKeywords(): RelevantKeywords {
    const indexer = new RecipeIndexer()

    this.repository.all().forEach((recipe) => indexer.indexRecipe(recipe))

    return indexer.getRelevantKeywords()
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
    const recipes =
      filters.query.length < 3
        ? this.repository.all()
        : this.recipesByDichotomicSearch(filters.query)

    return recipes.filter((recipe) => this.matchesRecipeFilters(recipe, filters))
  }

  private recipesByDichotomicSearch(string: string): Array<Recipe> {
    const recipeIds = dedupeItems(
      Keyword.fromText(string).flatMap((keyword) => this.recipeIdsByDichotomicSearch(keyword)),
    )

    return recipeIds.reduce((recipes, recipeId) => {
      const recipe = this.repository.findById(recipeId)

      if (recipe) {
        recipes.push(recipe)
      }

      return recipes
    }, [] as Array<Recipe>)
  }
  private recipeIdsByDichotomicSearch(keyword: Keyword): Array<RecipeId> {
    let min = 0,
      max = this.relevantKeywords.length - 1

    while (min <= max) {
      const mid = Math.floor((min + max) / 2)
      const guess = this.relevantKeywords[mid]

      if (!guess) return []

      const result = guess.keyword.localeCompare(keyword.text)

      if (result === 0) return guess.recipeIds

      if (result > 0) {
        max = mid - 1
      } else {
        min = mid + 1
      }
    }

    return []
  }

  private matchesRecipeFilters(recipe: Recipe, filters: RecipeFilters): boolean {
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

    return true
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
