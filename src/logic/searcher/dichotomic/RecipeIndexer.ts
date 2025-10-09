import type { Recipe, RecipeId } from '@/logic/Recipe'
import { Keyword } from '@/logic/searcher/dichotomic/Keyword'

type CountByRecipe = Map<RecipeId, number>
type KeywordCountByRecipe = Map<Keyword['text'], CountByRecipe>
type RelevantKeywords = Map<Keyword['text'], [RecipeId]>

export class RecipeIndexer {
  public static readonly MIN_WORD_LENGTH = 3
  public static readonly MIN_COUNT_TO_BE_RELEVANT = 3
  private keywordCountByRecipe: KeywordCountByRecipe = new Map()
  private relevantKeywords: RelevantKeywords = new Map()
  private areRelevantKeywordsComputed = false

  indexRecipe(recipe: Recipe) {
    recipe.ingredients.forEach((ingredient) => {
      this.processText(ingredient.ingredient, recipe.id)
    })

    this.processText(recipe.appliance, recipe.id)

    recipe.ustensils.forEach((ustensil) => {
      this.processText(ustensil, recipe.id)
    })

    this.processText(recipe.name, recipe.id)
    this.processText(recipe.description, recipe.id)
  }

  private processText(text: string, recipeId: RecipeId) {
    Keyword.fromText(text).forEach((keyword) => this.incrementKeywordForRecipe(keyword, recipeId))
  }

  private incrementKeywordForRecipe(keyword: Keyword, recipeId: RecipeId) {
    this.areRelevantKeywordsComputed = false

    const countByRecipe = this.keywordCountByRecipe.get(keyword.text)

    if (countByRecipe) {
      const currentCount = countByRecipe.get(recipeId) ?? 0
      countByRecipe.set(recipeId, currentCount + 1)
    } else {
      const countByRecipe: CountByRecipe = new Map()
      countByRecipe.set(recipeId, 1)
      this.keywordCountByRecipe.set(keyword.text, countByRecipe)
    }
  }

  private getRelevantKeywords(): RelevantKeywords {
    const keywords: RelevantKeywords = new Map()

    this.keywordCountByRecipe.forEach((countByRecipe, word) => {
      const totalCount = Array.from(countByRecipe.values()).reduce(
        (total, recipeCount) => total + recipeCount,
        0,
      )

      if (totalCount >= RecipeIndexer.MIN_COUNT_TO_BE_RELEVANT) {
        keywords.set(word, [...countByRecipe.keys()] as [RecipeId])
      }
    })

    return keywords
  }

  findRecipeIdsByText(text: string): Array<RecipeId> {
    return this.findRecipeIdsByKeywords(Keyword.fromText(text))
  }

  findRecipeIdsByKeywords(queryKeywords: Array<Keyword>): Array<RecipeId> {
    if (!this.areRelevantKeywordsComputed) {
      this.relevantKeywords = this.getRelevantKeywords()
      this.areRelevantKeywordsComputed = true
    }

    const foundRecipeIds = new Set<RecipeId>()

    for (const [keyword, recipeIds] of this.relevantKeywords.entries()) {
      if (queryKeywords.some((queryKeyword) => keyword.includes(queryKeyword.text))) {
        recipeIds.forEach((id) => foundRecipeIds.add(id))
      }
    }

    return Array.from(foundRecipeIds)
  }
}
