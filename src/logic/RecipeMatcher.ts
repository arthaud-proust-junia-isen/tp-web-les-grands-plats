import type { Recipe } from '@/logic/Recipe'

export class RecipeMatcher {
  constructor(private recipe: Recipe) {}

  byIngredient(query: string): boolean {
    return this.recipe.ingredients.some((ingredient) =>
      ingredient.ingredient.toLowerCase().includes(query.toLowerCase()),
    )
  }

  byUstensil(query: string): boolean {
    return this.recipe.ustensils.some((ustensil) =>
      ustensil.toLowerCase().includes(query.toLowerCase()),
    )
  }

  byAppliance(query: string): boolean {
    return this.recipe.appliance.toLowerCase().includes(query.toLowerCase())
  }

  byName(query: string): boolean {
    return this.recipe.name.toLowerCase().includes(query.toLowerCase())
  }

  byQuery(query: string): boolean {
    return (
      this.byName(query) ||
      this.byIngredient(query) ||
      this.byAppliance(query) ||
      this.byUstensil(query)
    )
  }
}
