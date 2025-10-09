import { describe, expect, it as baseIt } from 'vitest'
import { RecipeRepository } from './RecipeRepository'
import { RecipeSearcher } from './RecipeSearcher'

const RECIPES = [
  {
    id: 1,
    name: 'Limonade de Coco',
    servings: 1,
    ingredients: [
      {
        ingredient: 'Lait de coco',
        quantity: '400',
        unit: 'ml',
      },
      {
        ingredient: 'Jus de citron',
        quantity: '2',
      },
      {
        ingredient: 'Crème de coco',
        quantity: '2',
        unit: 'cuillères à soupe',
      },
      {
        ingredient: 'Sucre',
        quantity: '30',
        unit: 'grammes',
      },
      {
        ingredient: 'Glaçons',
      },
    ],
    time: 10,
    description:
      "Mettre les glaçons à votre goût dans le blender, ajouter le lait, la crème de coco, le jus de 2 citrons et le sucre. Mixer jusqu'à avoir la consistence désirée",
    appliance: 'Blender thermomix',
    ustensils: ['cuillère à Soupe', 'verres', 'presse citron'],
  },
  {
    id: 2,
    name: 'Poisson Cru à la tahitienne',
    servings: 2,
    ingredients: [
      {
        ingredient: 'Thon Rouge (ou blanc)',
        quantity: '200',
        unit: 'grammes',
      },
      {
        ingredient: 'Concombre',
        quantity: '1',
      },
      {
        ingredient: 'Tomate',
        quantity: '2',
      },
      {
        ingredient: 'Carotte',
        quantity: '1',
      },
      {
        ingredient: 'Citron Vert',
        quantity: '5',
      },
      {
        ingredient: 'Lait de Coco',
        quantity: '100',
        unit: 'ml',
      },
    ],
    time: 60,
    description:
      'Découper le thon en dés, mettre dans un plat et recouvrir de jus de citron vert (mieux vaut prendre un plat large et peu profond). Laisser reposer au réfrigérateur au moins 2 heures. (Si possible faites-le le soir pour le lendemain. Après avoir laissé mariner le poisson, coupez le concombre en fines rondelles sans la peau et les tomates en prenant soin de retirer les pépins. Rayer la carotte. Ajouter les légumes au poissons avec le citron cette fois ci dans un Saladier. Ajouter le lait de coco. Pour ajouter un peu plus de saveur vous pouver ajouter 1 à 2 cuillères à soupe de Crème de coco',
    appliance: 'Saladier',
    ustensils: ['presse citron'],
  },
]

export const it = baseIt.extend<{
  searcher: RecipeSearcher
}>({
  searcher: async ({}, use) => {
    const repo = new RecipeRepository(RECIPES)
    await use(new RecipeSearcher(repo))
  },
})

describe('RecipeSearcher', () => {
  describe('no search', () => {
    it('returns all results', ({ searcher }) => {
      expect(searcher.getResults()).toStrictEqual(RECIPES)
    })

    it('returns all ingredients ', ({ searcher }) => {
      expect(searcher.getAvailableIngredients()).toEqual([
        'lait de coco',
        'jus de citron',
        'crème de coco',
        'sucre',
        'glaçons',

        'thon rouge (ou blanc)',
        'concombre',
        'tomate',
        'carotte',
        'citron vert',
      ])
    })

    it('returns all appliances', ({ searcher }) => {
      expect(searcher.getAvailableAppliances()).toEqual(['blender thermomix', 'saladier'])
    })

    it('returns all ustensils ', ({ searcher }) => {
      expect(searcher.getAvailableUstensils()).toEqual([
        'cuillère à soupe',
        'verres',
        'presse citron',
      ])
    })
  })

  describe('searching with query shorter than 3 chars', () => {
    it("doesn't take in account search query", ({ searcher }) => {
      searcher.query = 'ab'

      expect(searcher.getResults()).toStrictEqual(RECIPES)
    })

    it('takes in account ingredients', ({ searcher }) => {
      searcher.query = 'ab'
      searcher.ingredients.add('Crème de coco')

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]])
    })

    it('takes in account appliances', ({ searcher }) => {
      searcher.query = 'ab'
      searcher.appliances.add('Blender thermomix')

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]])
    })

    it('takes in account ustensils', ({ searcher }) => {
      searcher.query = 'ab'
      searcher.ustensils.add('cuillère à Soupe')

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]])
    })
  })

  describe('searching by name', () => {
    it('returns recipe matching exactly', ({ searcher }) => {
      searcher.query = 'Limonade de Coco'

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]])
    })

    it('returns recipe matching', ({ searcher }) => {
      searcher.query = 'Limonade'

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]])
    })

    it('returns recipe matching with different case', ({ searcher }) => {
      searcher.query = 'limonade'

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]])
    })

    it('returns available ingredients for query', ({ searcher }) => {
      searcher.query = 'Limonade de Coco'

      expect(searcher.getAvailableIngredients()).toEqual([
        'lait de coco',
        'jus de citron',
        'crème de coco',
        'sucre',
        'glaçons',
      ])
    })

    it('returns available appliances for query', ({ searcher }) => {
      searcher.query = 'Limonade de Coco'

      expect(searcher.getAvailableAppliances()).toEqual(['blender thermomix'])
    })

    it('returns available ustensils for query ', ({ searcher }) => {
      searcher.query = 'Poisson Cru à la tahitienne'

      expect(searcher.getAvailableUstensils()).toEqual(['presse citron'])
    })
  })

  describe('searching by ingredient name', () => {
    it('returns recipe matching exactly', ({ searcher }) => {
      searcher.query = 'Sucre'

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]])
    })

    it('returns recipe matching partially', ({ searcher }) => {
      searcher.query = 'Sucr'

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]])
    })

    it('returns recipe matching with different case', ({ searcher }) => {
      searcher.query = 'sucre'

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]])
    })
  })

  describe('searching by ustensils name', () => {
    it('returns recipe matching exactly', ({ searcher }) => {
      searcher.query = 'cuillère à Soupe'

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]])
    })

    it('returns recipe matching partially', ({ searcher }) => {
      searcher.query = 'cuillère à Soup'

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]])
    })

    it('returns recipe matching with different case', ({ searcher }) => {
      searcher.query = 'cuillère à soupe'

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]])
    })
  })

  describe('searching by appliance name', () => {
    it('returns recipe matching exactly', ({ searcher }) => {
      searcher.query = 'Blender thermomix'

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]])
    })

    it('returns recipe matching partially', ({ searcher }) => {
      searcher.query = 'Blender thermomi'

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]])
    })

    it('returns recipe matching with different case', ({ searcher }) => {
      searcher.query = 'blender thermomix'

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]])
    })
  })

  describe('filters applied, then removed', () => {
    it('returns all results', ({ searcher }) => {
      searcher.appliances.add('test')
      searcher.appliances.delete('test')

      expect(searcher.getResults()).toStrictEqual(RECIPES)
    })
  })
})
