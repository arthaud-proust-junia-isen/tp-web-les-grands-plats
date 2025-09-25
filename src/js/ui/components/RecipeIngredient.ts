import type { Ingredient } from "../../logic/Recipe";

export const RecipeIngredient = (props: {
  ingredient: Ingredient;
}): HTMLDivElement => {
  const template = document.getElementById(
    "recipe-ingredient",
  ) as HTMLTemplateElement;

  const fragment = document.importNode(template.content, true);

  const el = fragment.firstElementChild as HTMLDivElement;

  const ingredientEl = el.querySelector(
    ".card-ingredients-list-item-ingredient",
  ) as HTMLElement;
  ingredientEl.innerText = props.ingredient.ingredient;

  if (props.ingredient.quantity) {
    const quantityEl = el.querySelector(
      ".card-ingredients-list-item-quantity",
    ) as HTMLElement;
    quantityEl.innerText = props.ingredient.quantity;
  }

  if (props.ingredient.unit) {
    const unitEl = el.querySelector(
      ".card-ingredients-list-item-unit",
    ) as HTMLElement;
    unitEl.innerText = props.ingredient.unit;
  }

  return el;
};
