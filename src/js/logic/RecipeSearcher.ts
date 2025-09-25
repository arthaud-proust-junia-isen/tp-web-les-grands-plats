import type { Recipe } from "./Recipe";
import type { RecipeRepository } from "./RecipeRepository";

const CHARS_COUNT_TO_START_QUERY = 3;

export class RecipeSearcher {
  private tags: Set<string> = new Set();
  private query: string = "";
  private repository: RecipeRepository;

  constructor(repository: RecipeRepository) {
    this.repository = repository;
  }

  addTag(tag: string) {
    this.tags.add(tag);
  }

  removeTag(tag: string) {
    this.tags.delete(tag);
  }

  search(query: string) {
    this.query = query;
  }

  getResults(): Array<Recipe> {
    return this.repository.getRecipes((recipe) => {
      if (this.query.length < CHARS_COUNT_TO_START_QUERY) {
        return true;
      }

      if (this.tags.size > 0 && !this.isRecipeMatchingSomeTag(recipe)) {
        return false;
      }

      return this.isRecipeMatchingQuery(recipe, this.query);
    });
  }

  private isRecipeMatchingSomeTag(recipe: Recipe): boolean {
    return [...this.tags].some((tag) =>
      this.isRecipeMatchingQuery(recipe, tag),
    );
  }

  private isRecipeMatchingQuery(recipe: Recipe, query: string): boolean {
    return (
      recipe.name.toLowerCase().includes(query.toLowerCase()) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(query.toLowerCase()),
      )
    );
  }
}
