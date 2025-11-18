import express from "express";
const router = express.Router();
export default router;

import { getTopLikedRecipes } from "../db/queries/recipes.js";

// GET /api/home/
router.route("/").get(async (req, res, next) => {
  try {
  const recipes = await getTopLikedRecipes();
  res.send(recipes);
  } catch (err) {
    next(err);
  }
});
