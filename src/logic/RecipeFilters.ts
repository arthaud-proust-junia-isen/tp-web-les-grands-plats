export interface RecipeFilters {
  ingredients: Array<string>
  appliances: Array<string>
  ustensils: Array<string>
  query: string
}

export class RecipeFiltersBuilder {
  filters: RecipeFilters

  constructor(filters: Partial<RecipeFilters> = {}) {
    this.filters = {
      ingredients: filters.ingredients ?? [],
      appliances: filters.appliances ?? [],
      ustensils: filters.ustensils ?? [],
      query: filters.query ?? '',
    }
  }

  withIngredient(ingredient: string) {
    this.filters.ingredients.push(ingredient.toLowerCase())
    return this
  }

  withAppliance(appliance: string) {
    this.filters.appliances.push(appliance.toLowerCase())
    return this
  }

  withUstensil(ustensil: string) {
    this.filters.ustensils.push(ustensil.toLowerCase())
    return this
  }

  withQuery(query: string) {
    this.filters.query = query.toLowerCase()
    return this
  }

  build() {
    return {
      ingredients: [...this.filters.ingredients],
      appliances: [...this.filters.appliances],
      ustensils: [...this.filters.ustensils],
      query: this.filters.query,
    }
  }
}
