// Add a liked recipe to the users liked recipies list
// Remove a liked recipe from the users liked list
// get all liked user recipies

import db from "../db/client.js";

export async function toggleLiked(userId, recipeId) {
  const { rows: existing } = await db.query(
    `SELECT id FROM liked_recipes WHERE user_id = $1 AND recipe_id = $2;`,
    [userId, recipeId]
  );

  // Check if the recipe is already liked
  if (existing.length > 0) {
    // If exists, remove the like
    await db.query(
      `DELETE FROM liked_recipes WHERE user_id = $1 AND recipe_id = $2;`,
      [userId, recipeId]
    );
    return { liked: false }; // change to unliked
  } else {
    // if not, add the like
    await db.query(
      `INSERT INTO liked_recipes (user_id, recipe_id) VALUES ($1, $2);`,
      [userId, recipeId]
    );
    return { liked: true }; // change to liked
  }
}

export async function getLikedRecipes(id) {
  const sql = `
    SELECT * FROM liked_recipes WHERE user_id = $1`;
  const { rows: liked } = await db.query(sql, [id]);
  return liked;
}
