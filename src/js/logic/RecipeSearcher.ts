import type { Recipe } from "./Recipe";
import type { RecipeRepository } from "./RecipeRepository";

const CHARS_COUNT_TO_START_QUERY = 3;

const dedupeItems = <T>(items: Array<T>) => Array.from(new Set(items));

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
      if (this.tags.size > 0 && !this.isRecipeMatchingSomeTag(recipe)) {
        return false;
      }

      if (this.query.length < CHARS_COUNT_TO_START_QUERY) {
        return true;
      }

      return this.isRecipeMatchingQuery(recipe, this.query);
    });
  }

  getAvailableIngredients(): Array<string> {
    return dedupeItems(
      this.getResults().flatMap((result) =>
        result.ingredients.map((ingredient) =>
          ingredient.ingredient.toLowerCase(),
        ),
      ),
    );
  }

  getAvailableAppliances(): Array<string> {
    return dedupeItems(
      this.getResults().map((result) => result.appliance.toLowerCase()),
    );
  }

  getAvailableUstensils(): Array<string> {
    return dedupeItems(
      this.getResults().flatMap((result) =>
        result.ustensils.map((ustensil) => ustensil.toLowerCase()),
      ),
    );
  }

  private isRecipeMatchingSomeTag(recipe: Recipe): boolean {
    return [...this.tags].some((tag) =>
      this.isRecipeMatchingQuery(recipe, tag),
    );
  }

  private isRecipeMatchingQuery(recipe: Recipe, query: string): boolean {
    return (
      recipe.name.toLowerCase().includes(query.toLowerCase()) ||
      recipe.appliance.toLowerCase().includes(query.toLowerCase()) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(query.toLowerCase()),
      ) ||
      recipe.ustensils.some((ustensil) =>
        ustensil.toLowerCase().includes(query.toLowerCase()),
      )
    );
  }
}
