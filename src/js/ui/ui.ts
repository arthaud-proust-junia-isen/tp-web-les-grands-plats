import slugify from "slugify";
import type { RecipeSearcher } from "../logic/RecipeSearcher";
import { SearchItem } from "./components/SearchItem";
import { RecipeCard } from "./components/RecipeCard";

export class UiManager {
  private readonly tagsContainer = document.getElementById(
    "tags-container",
  ) as HTMLDivElement;

  private readonly searchForm = document.getElementById(
    "search-form",
  ) as HTMLFormElement;
  private readonly searchInput = document.getElementById(
    "search-input",
  ) as HTMLInputElement;

  private readonly recipesList = document.getElementById(
    "recipes-list",
  ) as HTMLDivElement;

  private recipeSearcher: RecipeSearcher;

  constructor(recipeSearcher: RecipeSearcher) {
    this.recipeSearcher = recipeSearcher;

    this.searchInput.addEventListener("keyup", (e) => {
      e.preventDefault();

      this.recipeSearcher.search(this.searchInput.value);
      this.renderResults();
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
    this.recipesList.innerHTML = "";

    this.recipeSearcher.getResults().forEach((recipe) => {
      this.recipesList.appendChild(RecipeCard({ recipe }));
    });
  }
}
