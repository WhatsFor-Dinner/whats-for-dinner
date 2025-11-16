import express from "express";
const router = express.Router();
export default router;

import { getTopLikedRecipes } from "#src-backend/db/queries/recipies";

// GET /api/home/
router.route("/").get(async (req, res) => {
  const recipes = await getTopLikedRecipes();
  res.send(recipes);
});
