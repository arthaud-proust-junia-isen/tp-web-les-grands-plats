import { RecipeIndexer } from '@/logic/searcher/dichotomic/RecipeIndexer'
import { it as baseIt, describe, expect } from 'vitest'

const RECIPE = {
  id: 1,
  name: 'Limonade de coco',
  servings: 1,
  ingredients: [{ ingredient: 'Crème de coco', quantity: '4', unit: 'cl' }],
  time: 10,
  description: "Délicieuse limonade de coco, à la fois sucrée et acidulée, parfaite pour l'été",
  appliance: 'Blender thermomix',
  ustensils: ['cuillère à Soupe', 'verres', 'presse citron'],
}

const it = baseIt.extend<{
  register: RecipeIndexer
}>({
  register: async ({}, use) => {
    await use(new RecipeIndexer())
  },
})

describe('RecipeIndexer', () => {
  it('returns words occuring more than 3 times', ({ register }) => {
    register.indexRecipe(RECIPE)

    const keywords = register.getRelevantKeywords()

    expect(keywords).toContainEqual({ keyword: 'coco', recipeIds: [RECIPE.id] })
    expect(keywords).not.toContainEqual({ keyword: 'limonade', recipeIds: [RECIPE.id] })
  })

  it("doesn't return by words less than 3 caracters long", ({ register }) => {
    register.indexRecipe(RECIPE)

    const keywords = register.getRelevantKeywords()

    expect(keywords).not.toContainEqual({ keyword: 'de', recipeIds: [RECIPE.id] })
  })

  it('sanitize keywords', ({ register }) => {
    register.indexRecipe({
      id: 1,
      name: 'Kïwi',
      servings: 1,
      ingredients: [{ ingredient: 'Kiwi', quantity: '4', unit: 'cl' }],
      time: 10,
      description: 'Délicieuse kiwi',
      appliance: 'Blender thermomix',
      ustensils: ['cuillère à Soupe', 'verres', 'presse citron'],
    })

    const keywords = register.getRelevantKeywords()

    expect(keywords).toContainEqual({ keyword: 'kiwi', recipeIds: [RECIPE.id] })
  })
})
