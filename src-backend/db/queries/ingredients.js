import db from "../db/client.js";

// This function will search the ingredient and update results as the user is typing
export async function searchIngredientsByName(input) {
  const sql = `
    SELECT id, name
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

// This will add the ingredient to the DB from the spoonacular API if it does not already exist
export async function insertIngredient(name) {
  const sql = `
    INSERT INTO ingredients (name)
     VALUES ($1)
     ON CONFLICT (name) DO NOTHING
     RETURNING id, name;
    `;
  const { rows } = await db.query(sql, [name]);

  return rows[0];
}
