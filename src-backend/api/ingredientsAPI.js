import express from "express";
const router = express.Router();
export default router;

import {
  searchIngredientsByName,
  insertIngredient,
} from "#db/queries/ingredients.js";

// GET: Search ingredients by name, first in DB then in Spoonacular if not found. If found in Spoonacular, save to DB.
router.get("/ingredients/search", async (req, res, next) => {
  try {
    // if query is missing or undefined, set to empty string
    const searchTerm = (req.query.query || "").trim();

    if (!searchTerm) {
      return res.send([]); // return empty array directly since what the user inputted is empty
    }

    // First search the DB
    const dbResults = await searchIngredientsByName(searchTerm);

    // If found in DB, return those results
    if (dbResults.length > 0) {
      return res.send(dbResults); // raw array
    }

    // If not found in DB, search Spoonacular API
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const url = new URL(
      "https://api.spoonacular.com/food/ingredients/autocomplete"
    );

    // Set URL parameters for the API request. Final URL will look like:
    // https://api.spoonacular.com/food/ingredients/autocomplete?query=apple&number=10&apiKey=YOUR_API_KEY
    url.searchParams.set("query", searchTerm);
    url.searchParams.set("number", "10");
    url.searchParams.set("apiKey", apiKey);

    //Send GET request to Spoonacular API
    const response = await fetch(url);
    const apiData = await response.json();

    // If spoonacular returns something unexpected or empty array (no matching ingredients), return empty array
    if (!Array.isArray(apiData) || apiData.length === 0) {
      return res.send([]);
    }

    // New array to store ingredients that will be saved to DB
    const saved = [];
    // for each ingredient returned from Spoonacular, save to our DB
    for (const item of apiData) {
      const name = item.name;
      const added = await insertIngredient(name);
      saved.push(added);
    }

    return res.send(saved); // raw response to frontend
  } catch (error) {
    next(error);
  }
});
