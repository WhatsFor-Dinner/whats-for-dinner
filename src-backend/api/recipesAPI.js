import express from "express";
const router = express.Router();
export default router;

import { searchRecipes } from "#src-backend/db/queries/recipies";
import requireUser from "#middleware/requireUser.js";
import { toggleLiked } from "#db/queries/favoriteRecipies.js";
import { requireBody } from "#middleware/requireBody.js";
import { createRecipe } from "#db/queries/recipies.js";
import { getRecipeCard } from "#db/queries/recipies.js";

router.route("/recipes").get(async (req, res, next) => {
  try {
    const results = await searchRecipes(req.query);
    res.send(results);
  } catch (error) {
    next(error);
  }
});

router.route("/recipes/:id").get(async (req, res, next) => {
  try {
    const recipeId = req.params.id;

    if (isNaN(recipeId)) {
      return res.status(400).send("Recipe ID must be a number.");
    }

    const recipe = await getRecipeCard(recipeId);
    if (!recipe) {
      return res.status(404).send("Recipe not found.");
    }
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

// POST: Toggle like/unlike for a recipe but a user must be logged in
router.route("/recipes/:id/like").post(requireUser, async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user.id;

    if (!userId) {
      return res
        .status(401)
        .send("You must be logged in to like/unlike a recipe.");
    }

    if (isNaN(userId) || isNaN(recipeId)) {
      return res
        .status(400)
        .send("User ID and Recipe ID must be valid numbers.");
    }

    const result = await toggleLiked(userId, recipeId);
    res.send(result);
  } catch (error) {
    next(error);
  }
});

// POST: Create a new recipe with ingredients, user must be logged in
router
  .route("/recipes/create")
  .post(requireUser, requireBody, async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { ingredients = [], ...recipeData } = req.body;

      const newRecipe = await createRecipe(userId, recipeData, ingredients);
      res.status(201).send(newRecipe);
    } catch (error) {
      next(error);
    }
  });
