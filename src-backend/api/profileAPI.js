import express from "express";
const router = express.Router();
export default router;

import { getRecipesCreatedByUser } from "../db/queries/recipes.js";
import { getLikedRecipes } from "../db/queries/likedRecipies.js";
import requireUser from "../middleware/requireUser.js";

// sends an array of all products
router.route("/my-recipes").get(requireUser, async (req, res, next) => {
  try {
    const userRecipes = await getRecipesCreatedByUser(req.user.id);
    res.send(userRecipes);
  } catch (error) {
    next(error);
  }
});

router
  .route("/liked-recipes")
  .get(requireUser, async (req, res, next) => {
    try {
      const userId = req.user.id;
      if (userId === null) {
        return res
          .status(401)
          .send("User must be logged in to view liked recipes.");
      }

      if (userId === undefined || isNaN(userId)) {
        return res.status(400).send("Invalid user ID.");
      }

      const likedRecipes = await getLikedRecipes(userId);
      if (!likedRecipes || likedRecipes.length === 0) {
        return res.status(404).send("No liked recipes found for this user.");
      }
      res.send(likedRecipes);
    } catch (error) {
      next(error);
    }
  });
