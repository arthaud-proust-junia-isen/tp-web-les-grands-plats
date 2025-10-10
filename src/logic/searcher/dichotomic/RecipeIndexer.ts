import type { Recipe, RecipeId } from '@/logic/Recipe'
import { Keyword } from '@/logic/searcher/dichotomic/Keyword'

type CountByRecipe = Map<RecipeId, number>
type KeywordCountByRecipe = Map<Keyword['text'], CountByRecipe>
export type RelevantKeywords = Array<{ keyword: Keyword['text']; recipeIds: [RecipeId] }>

export class RecipeIndexer {
  public static readonly MIN_WORD_LENGTH = 3
  public static readonly MIN_COUNT_TO_BE_RELEVANT = 3
  private keywordCountByRecipe: KeywordCountByRecipe = new Map()

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

  getRelevantKeywords(): RelevantKeywords {
    const keywords = [] as RelevantKeywords

    this.keywordCountByRecipe.forEach((countByRecipe, keyword) => {
      const totalCount = Array.from(countByRecipe.values()).reduce(
        (total, recipeCount) => total + recipeCount,
        0,
      )

      if (totalCount >= RecipeIndexer.MIN_COUNT_TO_BE_RELEVANT) {
        keywords.push({ keyword: keyword, recipeIds: [...countByRecipe.keys()] as [RecipeId] })
      }
    })

    return keywords.sort((a, b) => new Intl.Collator('sv').compare(a.keyword, b.keyword))
  }
}
