import { Keyword } from '@/logic/searcher/dichotomic/Keyword'
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
  it('indexes by words occuring more than 3 times', ({ register }) => {
    register.indexRecipe(RECIPE)

    expect(register.findRecipeIdsByKeywords(Keyword.fromText('coco'))).toEqual([RECIPE.id])
    expect(register.findRecipeIdsByKeywords(Keyword.fromText('limonade'))).toEqual([])
  })

  it("doesn't indexes by words less than 3 caracters long", ({ register }) => {
    register.indexRecipe(RECIPE)

    expect(register.findRecipeIdsByKeywords(Keyword.fromText('de'))).toEqual([])
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

    expect(register.findRecipeIdsByKeywords(Keyword.fromText('kiwi'))).toEqual([RECIPE.id])
  })
})
