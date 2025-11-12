import db from "#db/client";

// POST: Creates recipe and adds it to the DB
export async function createRecipe(
  user_id,
  recipe_name,
  description,
  type_of_cuisine,
  difficulty,
  chef_rating,
  number_of_servings,
  prep_time_minutes,
  cook_time_minutes,
  allergen_info,
  calories,
  protein_grams,
  carbs_grams,
  fat_grams,
  notes,
  instructions,
  picture_url
) {
  const sql = `
  INSERT INTO recipies
     (user_id,
      recipe_name,
      description,
      type_of_cuisine,
      difficulty,
      chef_rating,
      number_of_servings,
      prep_time_minutes,
      cook_time_minutes,
      allergen_info,
      calories,
      protein_grams,
      carbs_grams,
      fat_grams,
      notes,
      instructions,
      picture_url)
  VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9,
      $10, $11, $12, $13, $14, $15, $16, $17)
  RETURNING *
  `;
  const {
    rows: [recipe],
  } = await db.query(sql, [
    user_id,
    recipe_name,
    description,
    type_of_cuisine,
    difficulty,
    chef_rating,
    number_of_servings,
    prep_time_minutes,
    cook_time_minutes,
    allergen_info,
    calories,
    protein_grams,
    carbs_grams,
    fat_grams,
    notes,
    instructions,
    picture_url,
  ]);
  return recipe;
}

// GET: Pulls list of user created recipies
export async function getRecipiesByUserId(id) {
  const sql = `
  SELECT *
  FROM recipies
  WHERE user_id = $1
  `;
  const { rows: recipies } = await db.query(sql, [id]);
  return recipies;
}

// DELETE: Deletes the recipe only if the user created it
export async function deleteRecipieByUserId(id, user_id) {
  const sql = `
  DELETE FROM recipies
  WHERE id = $1
  AND user_id = $2
  `;
  const { rows: recipie } = await db.query(sql, [id, user_id]);
  return recipie;
}
