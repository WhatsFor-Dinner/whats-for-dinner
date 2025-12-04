import db from "../client.js";

// POST: Creates a new recipe along with its ingredients
// This function uses a transaction to ensure both recipe and ingredients are added together. If one fails, both are rolled back meaning no partial data is saved. This is essential for data integrity since we don't want recipes without their ingredients or vice versa. BEGIN starts the transaction, COMMIT saves changes, and ROLLBACK undoes changes if there's an error. Try and catch blocks are used to handle any errors that may occur during the process. if the errors occurs, the ROLLBACK is executed in the catch block to maintain database consistency.

export async function createRecipe(userId, recipeData, ingredients) {
  await db.query("BEGIN");

  try {
    // insert all the other recipe info into recipes table
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
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;
    // Prepare the values array for parameterized query in await function below
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
export async function getRecipeCard(id, userId = null) {
  const sql = `
    SELECT
      recipes.id,
      recipes.user_id,
      users.username,
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
      COALESCE(liked_counts.like_count, 0) AS like_count,
      COALESCE(ingredients_group.ingredients, '[]') AS ingredients,
      CASE 
        WHEN $2::integer IS NOT NULL AND user_likes.user_id IS NOT NULL 
        THEN true 
        ELSE false 
      END AS is_liked

    FROM recipes

    -- get creator username
    JOIN users
      ON users.id = recipes.user_id

    -- INGREDIENTS SUBQUERY (returns a JSON array)
    LEFT JOIN (
      SELECT
        recipe_ingredients.recipe_id,
        json_agg(
          json_build_object(
            'ingredientId', recipe_ingredients.ingredient_id,
            'name',         ingredients.name,
            'quantity',     recipe_ingredients.quantity,
            'unit',         recipe_ingredients.unit
          )
          ORDER BY ingredients.name
        ) AS ingredients
      FROM recipe_ingredients
      JOIN ingredients
        ON ingredients.id = recipe_ingredients.ingredient_id
      GROUP BY recipe_ingredients.recipe_id
    ) AS ingredients_group
      ON ingredients_group.recipe_id = recipes.id

    -- LIKES SUBQUERY
    LEFT JOIN (
      SELECT
        liked_recipes.recipe_id,
        COUNT(*) AS like_count
      FROM liked_recipes
      GROUP BY liked_recipes.recipe_id
    ) AS liked_counts
      ON liked_counts.recipe_id = recipes.id

    -- CHECK IF CURRENT USER LIKED THIS RECIPE
    LEFT JOIN liked_recipes AS user_likes
      ON user_likes.recipe_id = recipes.id 
      AND user_likes.user_id = $2

    WHERE recipes.id = $1;
  `;

  const {
    rows: [recipe],
  } = await db.query(sql, [id, userId]);

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
  RETURNING *;
  `;
  const { rows } = await db.query(sql, [id, user_id]);
  return rows[0];
}

// GET: Pulls the top 10 most liked recipes along with their like counts
export async function getTopLikedRecipes() {
  const sql = `
    SELECT
      recipes.id,
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
      recipes.id,
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
export async function searchRecipes(input, { limit = 15, offset = 0 } = {}) {
  const clean = (input || "").trim();
  // guardrails - allow up to 50 results
  const lim = Math.min(Math.max(parseInt(limit, 10) || 15, 1), 50);
  const off = Math.max(parseInt(offset, 10) || 0, 0);

  const sql = `
    SELECT id, recipe_name, description, cuisine_type, picture_url
    FROM recipes
    WHERE
      recipe_name  ILIKE $1 OR
      description  ILIKE $1 OR
      cuisine_type ILIKE $1
    ORDER BY recipe_name ASC
    LIMIT $2 OFFSET $3;
  `;
  const term = `%${clean}%`; // contains match instead of prefix only
  const { rows } = await db.query(sql, [term, lim, off]);
  return rows;
}

// Helper function to insert a new ingredient or get existing ingredient ID by name. Will be used in updateRecipeWithIngredients.
async function insertOrGetIngredientByName(name) {
  const insertSql = `
    INSERT INTO ingredients (name)
    VALUES ($1)
    ON CONFLICT (name) DO NOTHING
    RETURNING id;
  `;

  const { rows } = await db.query(insertSql, [name]);

  if (rows.length > 0) {
    return rows[0].id;
  }

  const { rows: existing } = await db.query(
    `SELECT id FROM ingredients WHERE name = $1;`,
    [name]
  );

  return existing[0].id;
}

// UPDATE: recipe + ingredients, only if recipe belongs to this user
export async function updateRecipeWithIngredients(
  recipeId,
  userId,
  recipeData,
  ingredients
) {
  // Start transaction to ensure both recipe and ingredients update together
  await db.query("BEGIN");

  try {
    // Update the recipe itself
    const updateSql = `
      UPDATE recipes
      SET
        recipe_name        = $3,
        description        = $4,
        cuisine_type       = $5,
        difficulty         = $6,
        chef_rating        = $7,
        number_of_servings = $8,
        prep_time_minutes  = $9,
        cook_time_minutes  = $10,
        calories           = $11,
        notes              = $12,
        instructions       = $13,
        picture_url        = $14
      WHERE id = $1
        AND user_id = $2
      RETURNING *;
    `;
    // Prepare values array for parameterized query
    const values = [
      recipeId,
      userId,
      recipeData.recipe_name,
      recipeData.description,
      recipeData.cuisine_type ?? null,
      recipeData.difficulty,
      recipeData.chef_rating ?? null,
      recipeData.number_of_servings,
      recipeData.prep_time_minutes ?? null,
      recipeData.cook_time_minutes ?? null,
      recipeData.calories ?? null,
      recipeData.notes ?? null,
      recipeData.instructions,
      recipeData.picture_url ?? null,
    ];

    const { rows: updatedRows } = await db.query(updateSql, values);

    // If no row was updated, recipe either doesn't exist or isn't owned by user
    if (updatedRows.length === 0) {
      await db.query("ROLLBACK");
      return null;
    }

    const updatedRecipe = updatedRows[0];

    // Replace ingredient links so that only provided/updated ingredients remain
    await db.query(`DELETE FROM recipe_ingredients WHERE recipe_id = $1;`, [
      recipeId,
    ]);

    if (Array.isArray(ingredients)) {
      for (const item of ingredients) {
        if (!item || !item.ingredientId) continue;

        await db.query(
          `
          INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
          VALUES ($1, $2, $3, $4);
        `,
          [
            recipeId,
            item.ingredientId,
            item.quantity ?? null,
            item.unit ?? null,
          ]
        );
      }
    }

    await db.query("COMMIT");
    return updatedRecipe;
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
}
