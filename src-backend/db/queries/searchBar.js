import db from "../db/client.js";

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
