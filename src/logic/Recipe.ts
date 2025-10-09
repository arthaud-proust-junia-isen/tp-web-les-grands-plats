import z from 'zod'

export const IngredientSchema = z.object({
  ingredient: z.string(),
  quantity: z.coerce.string().optional(),
  unit: z.string().optional(),
})
export type Ingredient = z.Infer<typeof IngredientSchema>

export const RecipeSchema = z.object({
  id: z.number(),
  name: z.string(),
  servings: z.number(),
  ingredients: z.array(IngredientSchema),
  time: z.number(),
  description: z.string(),
  appliance: z.string(),
  ustensils: z.array(z.string()),
})
export type Recipe = z.Infer<typeof RecipeSchema>
export type RecipeId = Recipe['id']

export const RecipeListSchema = z.array(RecipeSchema)
