import { useEffect, useId, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../Auth/Auth.jsx";
import { getIngredients, getIngredient } from "../../profileApi/ingredients.js";
import { createRecipe } from "../../profileApi/recipe.js";

function CreateRecipeCard({ syncRecipes }) {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [ingredient, setIngredient] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const synceIngredients = async () => {
      try {
        const data = await getIngredient(id);
        setIngredient(data);
      } catch (error) {
        setError(error.message);
      }
    };
    if (id) synceIngredients();
  }, [id]);

  const tryCreateRecipe = async (formData) => {
    setError(null);
    const image = formData.get("image");
    const name = formData.get("name");
    const cuisine = formData.get("cuisine");
    const prepTime = formData.get("prepTime");
    const cookTime = formData.get("cookTime");
    const macros = formData.get("macros");
    const calories = formData.get("calories");
    const ingredients = formData.get("ingredients");
    const measurements = formData.get("measurements");
    const instructions = formData.get("instructions");
    const notes = formData.get("notes");

    try {
      await createRecipe(token, {
        image,
        name,
        cuisine,
        prepTime,
        cookTime,
        macros,
        calories,
        ingredients,
        measurements,
        instructions,
        notes,
      });
      syncRecipes();
    } catch (error) {
      setError(e.message);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    tryCreateRecipe(formData);
  }

  return (
    <>
      <section className="create-recipe">
        <h2>Create A Recipe</h2>
        <form onSubmit={handleSubmit}>
          <label className="recipe-photo">
            Add Photo of Food
            <input type="file" />
          </label>

          <div className="health-info">
            <label>
              Calorie total:
              <p type="text" name="recipe name">
                {" "}
              </p>
              <p>Protien:</p>
              <p>Carbs:</p>
              <p>Fats</p>
              <label>Numer of Servings:</label>
            </label>
          </div>
          <label></label>

          <label>
            Recipe Name:
            <input type="text" name="recipe name" />
          </label>

          <label>
            Type of Cuisine:
            <input type="text" name="cuisine" />
          </label>

          <label>
            Prep Time:
            <input type="text" name="prep" />
          </label>

          <label>
            Cook Time: {/* Cook Time: I want time in mins */}
            <input type="text" name="cook time" />
          </label>

          <label className="ingredient-add">
            Ingredients: {/*  type, add, press enter to add  */}
            <input type="text" name=" ingredients" />
            <button type="button" className="ingredient-add">
              {" "}
              +{" "}
            </button>
          </label>
          <label>
            {" "}
            {/*  need to revisit */}
            Prep Instrutions:
            <ol>
              <li>Next step</li>
              <button type="button">next </button>
            </ol>
          </label>
          <label>
            Chef's Note:
            <input type="text" />
          </label>
          <section>
            <button type="submit" className="form-button">
              Create
            </button>
          </section>
        </form>
      </section>
    </>
  );
}

export default CreateRecipeCard;
