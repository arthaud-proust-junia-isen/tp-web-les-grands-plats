import type { Recipe } from "./Recipe";
import type { RecipeRepository } from "./RecipeRepository";

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
    const ALL_RECIPES_FILTER = () => true;

    return this.repository.getRecipes(
      this.tags.size === 0 ? ALL_RECIPES_FILTER : this.filterFn.bind(this),
    );
  }

  private filterFn(recipe: Recipe): boolean {
    for (const tag of this.tags.values()) {
      if (recipe.name.toLowerCase().includes(tag.toLowerCase())) {
        return true;
      }
    }

    return false;
  }
}
