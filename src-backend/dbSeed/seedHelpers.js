import db from "./client.js";

export async function insertOrGetIngredient(name) {
  const sql = `
    INSERT INTO ingredients (name)
    VALUES ($1)
    ON CONFLICT (name) DO NOTHING
    RETURNING id;
  `;
  // Try to insert the ingredient as a new row
  const { rows } = await db.query(sql, [name]);

  // If we inserted a new row, use that id
  if (rows.length > 0) {
    return rows[0].id;
  }

  // Otherwise look up the existing id
  const { rows: existingRows } = await db.query(
    `SELECT id FROM ingredients WHERE name = $1;`,
    [name]
  );
  // Return the existing id of the ingredient
  return existingRows[0].id;
}

export async function insertRecipe(recipe) {
  const sql = `
    INSERT INTO recipes (
      user_id,
      recipe_name,
      description,
      cuisine_type,
      difficulty,
      chef_rating,
      number_of_servings,
      prep_time_minutes,
      cook_time_minutes,
      calories,
      notes,
      instructions,
      picture_url
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
    )
    RETURNING *;
  `;
  // Prepare the values array for parameterized query in await function below
  const values = [
    recipe.user_id,
    recipe.recipe_name,
    recipe.description,
    recipe.cuisine_type ?? null,
    recipe.difficulty,
    recipe.chef_rating ?? null,
    recipe.number_of_servings,
    recipe.prep_time_minutes ?? null,
    recipe.cook_time_minutes ?? null,
    recipe.calories ?? null,
    recipe.notes ?? null,
    recipe.instructions,
    recipe.picture_url ?? null
  ];

  const { rows } = await db.query(sql, values);
  return rows[0];
}

// Links an ingredient to a recipe in the recipe_ingredients table
export async function linkIngredientToRecipe(recipeId, ingredientId, quantity, unit) {
  const sql = `
    INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
    VALUES ($1, $2, $3, $4);
  `;

  const values = [recipeId, ingredientId, quantity ?? null, unit ?? null];

  await db.query(sql, values);
};

