import express from "express";
const router = express.Router();
export default router;

import {
  searchRecipes,
  createRecipe,
  getRecipeCard,
  deleteRecipe,
  updateRecipeWithIngredients,
} from "../db/queries/recipes.js";
import { toggleLiked } from "../db/queries/likedRecipies.js";
import requireUser from "../middleware/requireUser.js";
import requireBody from "../middleware/requireBody.js";

router.route("/").get(async (req, res, next) => {
  try {
    const searchTerm = (req.query.query || "").trim();
    const results = await searchRecipes(searchTerm);
    res.send(results);
  } catch (error) {
    next(error);
  }
});

router
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const recipeId = req.params.id;

      if (isNaN(recipeId)) {
        return res.status(400).send("Recipe ID must be a number.");
      }

      
      const userId = req.user ? req.user.id : null;
      const recipe = await getRecipeCard(recipeId, userId);
      if (!recipe) {
        return res.status(404).send("Recipe not found.");
      }
      res.send(recipe);
    } catch (error) {
      next(error);
    }
  })
  .patch(requireUser, async (req, res, next) => {
    try {
      const recipeId = Number(req.params.id);
      const userId = req.user.id;

      if (Number.isNaN(recipeId)) {
        return res.status(400).send("Recipe ID must be a number.");
      }

     
      const { ingredients = [], ...recipeData } = req.body;

      const updated = await updateRecipeWithIngredients(
        recipeId,
        userId,
        recipeData,
        ingredients
      );

      if (!updated) {
        return res
          .status(404)
          .send("Recipe not found or you do not have permission to update it.");
      }

      
      const fullCard = await getRecipeCard(recipeId, userId);
      res.send(fullCard);
    } catch (error) {
      next(error);
    }
  })
  .delete(requireUser, async (req, res, next) => {
    try {
      const recipeId = Number(req.params.id);
      const userId = req.user.id;

      if (Number.isNaN(recipeId)) {
        return res.status(400).send("Recipe ID must be a number.");
      }

      const deleted = await deleteRecipe(recipeId, userId);
      if (!deleted) {
        return res
          .status(404)
          .send("Recipe not found or you do not have permission to delete it.");
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });


router.route("/:id/like").post(requireUser, async (req, res, next) => {
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
  .route("/create")
  .post(
    requireUser,
    requireBody([
      "recipe_name",
      "description",
      "difficulty",
      "number_of_servings",
      "prep_time_minutes",
      "cook_time_minutes",
      "instructions",
    ]),
    async (req, res, next) => {
      try {
        const userId = req.user.id;
        const { ingredients = [], ...recipeData } = req.body;

        const newRecipe = await createRecipe(userId, recipeData, ingredients);
        const fullRecipe = await getRecipeCard(newRecipe.id, userId);
        res.status(201).send(fullRecipe);
      } catch (error) {
        next(error);
      }
    }
  );
