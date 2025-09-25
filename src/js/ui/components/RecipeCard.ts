import type { Recipe } from "../../logic/Recipe";
import { RecipeIngredient } from "./RecipeIngredient";

export const RecipeCard = (props: { recipe: Recipe }): HTMLDivElement => {
  const template = document.getElementById(
    "recipe-card",
  ) as HTMLTemplateElement;

  const fragment = document.importNode(template.content, true);

  const el = fragment.firstElementChild as HTMLDivElement;

  const nameEl = el.querySelector(".card-name") as HTMLElement;
  nameEl.innerText = props.recipe.name;

  const timeEl = el.querySelector(".card-time") as HTMLElement;
  timeEl.innerText = props.recipe.time.toString();

  const descriptionEl = el.querySelector(".card-description") as HTMLElement;
  descriptionEl.innerText = props.recipe.description;

  const ingredientsListEl = el.querySelector(
    ".card-ingredients-list",
  ) as HTMLUListElement;

  props.recipe.ingredients.forEach((ingredient) => {
    ingredientsListEl.appendChild(RecipeIngredient({ ingredient }));
  });

  return el;
};
