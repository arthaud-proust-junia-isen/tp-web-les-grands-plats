import { beforeAll, describe, expect, it as baseIt } from "vitest";
import { RecipeRepository } from "./RecipeRepository";
import { RecipeSearcher } from "./RecipeSearcher";

const RECIPES = [
  {
    id: 1,
    name: "Limonade de Coco",
    servings: 1,
    ingredients: [
      {
        ingredient: "Lait de coco",
        quantity: "400",
        unit: "ml",
      },
      {
        ingredient: "Jus de citron",
        quantity: "2",
      },
      {
        ingredient: "Crème de coco",
        quantity: "2",
        unit: "cuillères à soupe",
      },
      {
        ingredient: "Sucre",
        quantity: "30",
        unit: "grammes",
      },
      {
        ingredient: "Glaçons",
      },
    ],
    time: 10,
    description:
      "Mettre les glaçons à votre goût dans le blender, ajouter le lait, la crème de coco, le jus de 2 citrons et le sucre. Mixer jusqu'à avoir la consistence désirée",
    appliance: "Blender",
    ustensils: ["cuillère à Soupe", "verres", "presse citron"],
  },
  {
    id: 2,
    name: "Poisson Cru à la tahitienne",
    servings: 2,
    ingredients: [
      {
        ingredient: "Thon Rouge (ou blanc)",
        quantity: "200",
        unit: "grammes",
      },
      {
        ingredient: "Concombre",
        quantity: "1",
      },
      {
        ingredient: "Tomate",
        quantity: "2",
      },
      {
        ingredient: "Carotte",
        quantity: "1",
      },
      {
        ingredient: "Citron Vert",
        quantity: "5",
      },
      {
        ingredient: "Lait de Coco",
        quantity: "100",
        unit: "ml",
      },
    ],
    time: 60,
    description:
      "Découper le thon en dés, mettre dans un plat et recouvrir de jus de citron vert (mieux vaut prendre un plat large et peu profond). Laisser reposer au réfrigérateur au moins 2 heures. (Si possible faites-le le soir pour le lendemain. Après avoir laissé mariner le poisson, coupez le concombre en fines rondelles sans la peau et les tomates en prenant soin de retirer les pépins. Rayer la carotte. Ajouter les légumes au poissons avec le citron cette fois ci dans un Saladier. Ajouter le lait de coco. Pour ajouter un peu plus de saveur vous pouver ajouter 1 à 2 cuillères à soupe de Crème de coco",
    appliance: "Saladier",
    ustensils: ["presse citron"],
  },
];

export const it = baseIt.extend<{
  searcher: RecipeSearcher;
}>({
  searcher: async ({}, use) => {
    const repo = new RecipeRepository(RECIPES);
    await use(new RecipeSearcher(repo));
  },
});

describe("RecipeSearcher", () => {
  describe("no search", () => {
    it("returns all results", ({ searcher }) => {
      expect(searcher.getResults()).toStrictEqual(RECIPES);
    });
  });

  describe("searching with query shorter than 3 chars", () => {
    it("returns all results", ({ searcher }) => {
      searcher.search("ab");

      expect(searcher.getResults()).toStrictEqual(RECIPES);
    });
  });

  describe("searching by name", () => {
    it("returns recipe matching exactly", ({ searcher }) => {
      searcher.search("Limonade de Coco");

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]]);
    });

    it("returns recipe matching", ({ searcher }) => {
      searcher.search("Limonade");

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]]);
    });

    it("returns recipe matching with different case", ({ searcher }) => {
      searcher.search("limonade");

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]]);
    });
  });

  describe("searching by ingredient name", () => {
    it("returns recipe matching exactly", ({ searcher }) => {
      searcher.search("Sucre");

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]]);
    });

    it("returns recipe matching partially", ({ searcher }) => {
      searcher.search("Sucr");

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]]);
    });

    it("returns recipe matching with different case", ({ searcher }) => {
      searcher.search("sucre");

      expect(searcher.getResults()).toStrictEqual([RECIPES[0]]);
    });
  });

  describe("filters applied, then removed", () => {
    it("returns all results", ({ searcher }) => {
      searcher.addTag("test");
      searcher.removeTag("test");

      expect(searcher.getResults()).toStrictEqual(RECIPES);
    });
  });
});
