import db from "#db/client";

// POST: Creates a new recipe along with its ingredients
// This function uses a transaction to ensure both recipe and ingredients are added together. If one fails, both are rolled back meaning no partial data is saved. This is essential for data integrity since we don't want recipes without their ingredients or vice versa. BEGIN starts the transaction, COMMIT saves changes, and ROLLBACK undoes changes if there's an error. Try and catch blocks are used to handle any errors that may occur during the process. if the errors occurs, the ROLLBACK is executed in the catch block to maintain database consistency.

export async function createRecipeWithIngredients(
  userId,
  recipeData,
  ingredients
) {
  await db.query("BEGIN");

  try {
    // First insert all the other recipe info into recipes table
    const insertRecipeSql = `
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
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
    `;
    // Values array for recipe insertion which matches the above SQL placeholders
    const recipeValues = [
      userId,
      recipeData.recipe_name,
      recipeData.description,
      recipeData.cuisine_type,
      recipeData.difficulty,
      recipeData.chef_rating,
      recipeData.number_of_servings,
      recipeData.prep_time_minutes,
      recipeData.cook_time_minutes,
      recipeData.calories,
      recipeData.notes,
      recipeData.instructions,
      recipeData.picture_url,
    ];

    const { rows: recipeRows } = await db.query(insertRecipeSql, recipeValues);
    const recipe = recipeRows[0];

    // Then insert ingredient info into recipe_ingredients (one row per selected ingredient)
    const insertIngredientSql = `
      INSERT INTO recipe_ingredients (
        recipe_id,
        ingredient_id,
        quantity,
        unit
      )
      VALUES ($1, $2, $3, $4);
    `;
    // Check if ingredients is an array and iterate to insert each one
    if (Array.isArray(ingredients)) {
      for (const item of ingredients) {
        // skip empty/invalid entries
        if (!item || !item.ingredientId) continue;

        await db.query(insertIngredientSql, [
          recipe.id,
          item.ingredientId,
          // If quantity or unit is missing, set to null
          item.quantity ?? null,
          item.unit ?? null,
        ]);
      }
    }
    // If all queries succeed, commit the transaction
    await db.query("COMMIT");

    return recipe;
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
}

// GET: Pulls a single recipe with its ingredients
export async function getRecipeWithIngredients(id) {
  const sql = `
    SELECT
      recipes.id,
      recipes.user_id,
      recipes.recipe_name,
      recipes.description,
      recipes.cuisine_type,
      recipes.difficulty,
      recipes.chef_rating,
      recipes.number_of_servings,
      recipes.prep_time_minutes,
      recipes.cook_time_minutes,
      recipes.calories,
      recipes.notes,
      recipes.instructions,
      recipes.picture_url,
 --Aggregate ingredients into a JSON array
      COALESCE(
        -- If there are ingredients, build the JSON array
        json_agg(
        -- Build a JSON object for each ingredient
          json_build_object(
            'id',       ingredients.id,
            'name',     ingredients.name,
            'quantity', recipe_ingredients.quantity,
            'unit',     recipe_ingredients.unit
          )
          ORDER BY ingredients.name
        ) FILTER (WHERE ingredients.id IS NOT NULL),
        '[]'
      ) AS ingredients

    FROM recipes
    LEFT JOIN recipe_ingredients
      ON recipe_ingredients.recipe_id = recipes.id
    LEFT JOIN ingredients
      ON ingredients.id = recipe_ingredients.ingredient_id

    WHERE recipes.id = $1

    GROUP BY
      recipes.id,
      recipes.user_id,
      recipes.recipe_name,
      recipes.description,
      recipes.cuisine_type,
      recipes.difficulty,
      recipes.chef_rating,
      recipes.number_of_servings,
      recipes.prep_time_minutes,
      recipes.cook_time_minutes,
      recipes.calories,
      recipes.notes,
      recipes.instructions,
      recipes.picture_url;
  `;

  const {
    rows: [recipe],
  } = await db.query(sql, [id]);

  return recipe; // one object or undefined
}

// GET: Pulls all recipes created by a specific user with their ingredients
export async function getRecipesCreatedByUser(userId) {
  const sql = `
    SELECT *
    FROM recipes
    WHERE user_id = $1
    ORDER BY id;
  `;
  const { rows } = await db.query(sql, [userId]);
  return rows;
}

// DELETE: Deletes the recipe only if the user created it
export async function deleteRecipe(id, user_id) {
  const sql = `
  DELETE FROM recipes
  WHERE id = $1
  AND user_id = $2
  `;
  const { rows } = await db.query(sql, [id, user_id]);
  return rows[0];
}

// GET: Pulls the top 10 most liked recipes along with their like counts
export async function getTopLikedRecipes() {
  const sql = `
    SELECT
      recipes.recipe_name,
      recipes.description,
      recipes.picture_url,
      users.username,
      COALESCE(COUNT(liked_recipes.recipe_id), 0) AS like_count
    FROM recipes
    JOIN users
      ON users.id = recipes.user_id
    LEFT JOIN liked_recipes
      ON liked_recipes.recipe_id = recipes.id
    GROUP BY
      recipes.recipe_name,
      recipes.description,
      recipes.picture_url,
      users.username
    ORDER BY like_count DESC
    LIMIT 10;
  `;

  const { rows } = await db.query(sql);
  return rows;
}

// GET: Search recipes by name for the search bar
// May need some optimization to show results more accuratly
export async function searchRecipes(input) {
  const sql = `
    SELECT *
    FROM recipes
    WHERE recipe_name ILIKE $1
    ORDER BY recipe_name
    LIMIT 10;
    `;
  // trim will remove extra spaces that may pass through from search since that can mess up the query matches
  const cleanInput = (input || "").trim();
  const { rows } = await db.query(sql, [`${cleanInput}%`]);
  return rows;
}
