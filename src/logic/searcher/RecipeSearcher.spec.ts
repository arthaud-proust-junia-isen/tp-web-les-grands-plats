import { RecipeFiltersBuilder } from '@/logic/RecipeFilters'
import { RecipeRepository } from '@/logic/RecipeRepository'
import { BaseRecipeSearcher } from '@/logic/searcher/BaseRecipeSearcher'
import { it as baseIt, describe, expect } from 'vitest'

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

;[BaseRecipeSearcher].forEach((RecipeSearcherClass) => {
  const it = baseIt.extend<{
    searcher: InstanceType<typeof RecipeSearcherClass>
    filtersBuilder: RecipeFiltersBuilder
  }>({
    searcher: async ({}, use) => {
      const repo = new RecipeRepository(RECIPES)
      await use(new RecipeSearcherClass(repo))
    },
    filtersBuilder: async ({}, use) => {
      await use(new RecipeFiltersBuilder())
    },
  })

  describe('RecipeSearcher', () => {
    describe('no search', () => {
      it('returns all results', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.build()

        const result = searcher.getResultsFor(filters)

        expect(result.recipes).toStrictEqual(RECIPES)
      })

      it('returns all ingredients ', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.build()

        const result = searcher.getResultsFor(filters)

        expect(result.availableIngredients).toEqual([
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

      it('returns all appliances', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.build()

        const result = searcher.getResultsFor(filters)

        expect(result.availableAppliances).toEqual(['blender thermomix', 'saladier'])
      })

      it('returns all ustensils ', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.build()

        const result = searcher.getResultsFor(filters)

        expect(result.availableUstensils).toEqual(['cuillère à soupe', 'verres', 'presse citron'])
      })
    })

    describe('searching with query shorter than 3 chars', () => {
      it("doesn't take in account search query", ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.withQuery('ab').build()

        const result = searcher.getResultsFor(filters)

        expect(result.recipes).toStrictEqual(RECIPES)
      })

      it('takes in account ingredients', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.withQuery('ab').withIngredient('Crème de coco').build()

        const result = searcher.getResultsFor(filters)

        expect(result.recipes).toStrictEqual([RECIPES[0]])
      })

      it('takes in account appliances', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.withQuery('ab').withAppliance('Blender thermomix').build()

        const result = searcher.getResultsFor(filters)

        expect(result.recipes).toStrictEqual([RECIPES[0]])
      })

      it('takes in account ustensils', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.withQuery('ab').withUstensil('cuillère à Soupe').build()

        const result = searcher.getResultsFor(filters)

        expect(result.recipes).toStrictEqual([RECIPES[0]])
      })
    })

    describe('searching by name', () => {
      it('returns recipe matching exactly', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.withQuery('Limonade de Coco').build()

        const result = searcher.getResultsFor(filters)

        expect(result.recipes).toStrictEqual([RECIPES[0]])
      })

      it('returns recipe matching', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.withQuery('Limonade').build()

        const result = searcher.getResultsFor(filters)

        expect(result.recipes).toStrictEqual([RECIPES[0]])
      })

      it('returns recipe matching with different case', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.withQuery('limonade').build()

        const result = searcher.getResultsFor(filters)

        expect(result.recipes).toStrictEqual([RECIPES[0]])
      })

      it('returns available filters for results', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.withQuery('Limonade de Coco').build()

        const result = searcher.getResultsFor(filters)

        expect(result.availableIngredients).toEqual([
          'lait de coco',
          'jus de citron',
          'crème de coco',
          'sucre',
          'glaçons',
        ])

        expect(result.availableAppliances).toEqual(['blender thermomix'])

        expect(result.availableUstensils).toEqual(['cuillère à soupe', 'verres', 'presse citron'])
      })
    })

    describe('searching by ingredient name', () => {
      it('returns recipe matching exactly', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.withIngredient('Sucre').build()

        const result = searcher.getResultsFor(filters)

        expect(result.recipes).toStrictEqual([RECIPES[0]])
      })

      it('returns recipe matching partially', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.withIngredient('Sucr').build()

        const result = searcher.getResultsFor(filters)

        expect(result.recipes).toStrictEqual([RECIPES[0]])
      })

      it('returns recipe matching with different case', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.withIngredient('sucre').build()

        const result = searcher.getResultsFor(filters)

        expect(result.recipes).toStrictEqual([RECIPES[0]])
      })
    })

    describe('searching by ustensils name', () => {
      it('returns recipe matching exactly', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.withUstensil('cuillère à soupe').build()

        const result = searcher.getResultsFor(filters)

        expect(result.recipes).toStrictEqual([RECIPES[0]])
      })

      it('returns recipe matching partially', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.withUstensil('cuillère à Soup').build()

        const result = searcher.getResultsFor(filters)

        expect(result.recipes).toStrictEqual([RECIPES[0]])
      })

      it('returns recipe matching with different case', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.withUstensil('cuillère à soupe').build()

        const result = searcher.getResultsFor(filters)

        expect(result.recipes).toStrictEqual([RECIPES[0]])
      })
    })

    describe('searching by appliance name', () => {
      it('returns recipe matching exactly', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.withAppliance('Blender thermomix').build()

        const result = searcher.getResultsFor(filters)

        expect(result.recipes).toStrictEqual([RECIPES[0]])
      })

      it('returns recipe matching partially', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.withAppliance('Blender thermomi').build()

        const result = searcher.getResultsFor(filters)

        expect(result.recipes).toStrictEqual([RECIPES[0]])
      })

      it('returns recipe matching with different case', ({ searcher, filtersBuilder }) => {
        const filters = filtersBuilder.withAppliance('blender thermomix').build()

        const result = searcher.getResultsFor(filters)

        expect(result.recipes).toStrictEqual([RECIPES[0]])
      })
    })
  })
})
