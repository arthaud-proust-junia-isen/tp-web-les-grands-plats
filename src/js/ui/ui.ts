import type { RecipeSearcher } from "../logic/RecipeSearcher";
import { SearchItem } from "./components/SearchItem";
import { RecipeCard } from "./components/RecipeCard";
import { TagAppliance, TagUstensil } from "./components/Tags";

const removeAllChilds = (element: HTMLElement) => {
  while (element.lastChild) {
    element.removeChild(element.lastChild);
  }
};

export class UiManager {
  private readonly tagsContainer = document.getElementById(
    "tags-container",
  ) as HTMLDivElement;

  private readonly searchInput = document.getElementById(
    "search-input",
  ) as HTMLInputElement;

  private readonly searchIngredientInput = document.getElementById(
    "search-ingredient",
  ) as HTMLInputElement;

  private readonly recipesList = document.getElementById(
    "recipes-list",
  ) as HTMLDivElement;

  private readonly ingredientsList = document.getElementById(
    "ingredients-list",
  ) as HTMLUListElement;

  private readonly appliancesList = document.getElementById(
    "appliances-list",
  ) as HTMLUListElement;

  private readonly ustensilsList = document.getElementById(
    "ustensils-list",
  ) as HTMLUListElement;

  private recipeSearcher: RecipeSearcher;

  constructor(recipeSearcher: RecipeSearcher) {
    this.recipeSearcher = recipeSearcher;

    this.searchInput.addEventListener("keyup", (e) => {
      e.preventDefault();

      this.searchIngredientInput.value = "";

      this.recipeSearcher.search(this.searchInput.value);
      this.renderResults();
    });

    this.searchIngredientInput.addEventListener("keyup", (e) => {
      e.preventDefault();

      this.renderIngredientResults();
    });

    this.renderResults();
  }

  private removeTag(name: string) {
    this.tagsContainer.querySelector(`[data-id="${name}"]`)?.remove();

    this.recipeSearcher.removeTag(name);
    this.renderResults();
  }

  private addTag(name: string) {
    const tagEl = SearchItem({
      name,
      onRemove: () => this.removeTag(name),
    });

    tagEl.dataset.id = name;

    this.tagsContainer.appendChild(tagEl);
    this.recipeSearcher.addTag(name);

    this.renderResults();
  }

  private renderResults() {
    removeAllChilds(this.recipesList);
    this.recipeSearcher.getResults().forEach((recipe) => {
      this.recipesList.appendChild(RecipeCard({ recipe }));
    });

    this.renderIngredientResults();

    removeAllChilds(this.appliancesList);
    this.recipeSearcher.getAvailableAppliances().forEach((appliance) => {
      const tag = TagAppliance({
        name: appliance,
        onClick: () => this.addTag(appliance),
      });
      this.appliancesList.appendChild(tag);
    });

    removeAllChilds(this.ustensilsList);
    this.recipeSearcher.getAvailableUstensils().forEach((ustensil) => {
      const tag = TagUstensil({
        name: ustensil,
        onClick: () => this.addTag(ustensil),
      });
      this.ustensilsList.appendChild(tag);
    });
  }

  private renderIngredientResults() {
    removeAllChilds(this.ingredientsList);
    this.recipeSearcher
      .getAvailableIngredients()
      .filter((ingredient) =>
        ingredient
          .toLowerCase()
          .includes(this.searchIngredientInput.value.toLowerCase()),
      )
      .forEach((ingredient) => {
        const tag = TagAppliance({
          name: ingredient,
          onClick: () => this.addTag(ingredient),
        });
        this.ingredientsList.appendChild(tag);
      });
  }
}
