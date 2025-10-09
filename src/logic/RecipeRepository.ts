import { RecipeListSchema, type Recipe } from './Recipe'

export class RecipeRepository {
  private recipes: Array<Recipe>

  static async fromExternalJson(url: string) {
    const data = await fetch(url)
    const recipes = RecipeListSchema.parse(await data.json())

    return new RecipeRepository(recipes)
  }

  constructor(recipes: Array<Recipe>) {
    this.recipes = recipes
  }

  filter(filterFn: (recipe: Recipe) => boolean = () => true) {
    return this.recipes.filter(filterFn)
  }

  all() {
    return [...this.recipes]
  }

  findById(id: number) {
    return this.recipes.find((recipe) => recipe.id === id)
  }
}
