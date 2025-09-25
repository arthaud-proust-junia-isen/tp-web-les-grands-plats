import { RecipeRepository } from "./logic/RecipeRepository";
import { RecipeSearcher } from "./logic/RecipeSearcher";
import { UiManager } from "./ui/ui";

const recipeRepository =
  await RecipeRepository.fromExternalJson("/json/recipes.json");

const recipeSearcher = new RecipeSearcher(recipeRepository);

new UiManager(recipeSearcher);
