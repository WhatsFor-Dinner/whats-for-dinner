import db from "../db/client.js";

// This function will search the ingredient and update results as the user is typing
export async function searchIngredientsByName(input) {
  const sql = `
    SELECT id, name, image
    FROM ingredients
    WHERE name ILIKE $1
    ORDER BY name
    LIMIT 10;
    `;
  // trim will remove extra spaces that may pass through from search since that can mess up the query matches
  const cleanInput = (input || "").trim();
  const { rows } = await db.query(sql, [`${cleanInput}%`]);
  return rows;
}

// This will add the ingredient to the DB from the
export async function insertIngredient(name, image) {
  const sql = `
    INSERT INTO ingredients (name, image)
     VALUES ($1, $2)
     ON CONFLICT (name) DO UPDATE
        SET image = EXCLUDED.image
     RETURNING id, name, image;
    `;
  const { rows: ingredient } = await db.query(sql, [id, name, image]);

  return ingredient;
}
