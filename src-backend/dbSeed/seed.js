import fs from "fs/promises";
import db from "../db/client.js";
import {
  insertRecipe,
  insertOrGetIngredient,
  linkIngredientToRecipe,
  seedUser
} from "./seedHelpers.js";


async function recipeData() {
  // Read and parse the seed data JSON file
  // What fs.readFile does is read the contents of a file and return it as a Buffer or string.
  const jsonData = await fs.readFile("./src-backend/dbSeed/sampleData.json", "utf-8");
  const recipes = JSON.parse(jsonData);

  return recipes;
}

async function seed() {
  try {
    console.log("Starting seed...");
    await db.query("SELECT 1")
    console.log("Database connected.");

    // create a seed user
    console.log("Creating seed user...");
    const user = await seedUser("demo_user", "password123");
    const userId = user.id;
    console.log("Seed user created with id:", userId);

    // load recipes from JSON
    console.log("Loading recipe seed data...");
    const recipes = await recipeData();
    console.log(`Found ${recipes.length} recipes in sampleData.json`);

    // seed recipes + ingredients in a loop
    for (const recipe of recipes) {
      // wrap each recipe in a transaction so partial inserts are avoided
      await db.query("BEGIN");

      try {
        // force user_id to the seed user, in case JSON has a different value
        const recipeToInsert = {
          ...recipe,
          user_id: userId,
        };
        
        // insert recipe
        const insertedRecipe = await insertRecipe(recipeToInsert);
        console.log(`Inserted recipe: ${insertedRecipe.recipe_name}`);

        // insert ingredients + link them
        if (Array.isArray(recipe.ingredients)) {
          for (const ingredient of recipe.ingredients) {
            const ingredientId = await insertOrGetIngredient(ingredient.name);

            await linkIngredientToRecipe(
              insertedRecipe.id,
              ingredientId,
              ingredient.quantity,
              ingredient.unit
            );
          }
        }

        await db.query("COMMIT");
      } catch (error) {
        await db.query("ROLLBACK");
        console.error(
          `Error seeding recipe "${recipe.recipe_name || recipe.name}":`,
          error
        );
        throw error;
      }
    }

    console.log("✅ Database Seeded.");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    console.log("Closing connection...");
    await db.end();
  }
}

seed();
