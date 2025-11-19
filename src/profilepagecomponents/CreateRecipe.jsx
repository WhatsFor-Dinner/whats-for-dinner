import { useEffect, useId, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../Auth/Auth.jsx";
import { getIngredients, getIngredient } from "../../profileApi/ingredients.js";
import { createRecipe } from "../../profileApi/recipe.js";
import Ingredients from "./Ingredients.jsx";
import "./CreateRecipe.css";

function CreateRecipeCard({ syncRecipes }) {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [ingredient, setIngredient] = useState(null);
  const [error, setError] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

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

  const handleAddIngredient = (ingredient) => {
    const newIngredient = {
      id: ingredient.id,
      name: ingredient.name,
      amount: "",
      unit: "",
    };
    setSelectedIngredients([...selectedIngredients, newIngredient]);
  };

  const handleRemoveIngredient = (index) => {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...selectedIngredients];
    updated[index][field] = value;
    setSelectedIngredients(updated);
  };

  const tryCreateRecipe = async (formData) => {
    setError(null);
    const image = formData.get("image");
    const name = formData.get("name");
    const cuisine = formData.get("cuisine");
    const prepTime = formData.get("prepTime");
    const cookTime = formData.get("cookTime");
    const macros = formData.get("macros");
    const calories = formData.get("calories");
    const instructions = formData.get("instructions");
    const notes = formData.get("notes");

    // Convert selectedIngredients array to format expected by backend
    const ingredientsData = selectedIngredients.map((ing) => ({
      id: ing.id,
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
    }));

    try {
      await createRecipe(token, {
        image,
        name,
        cuisine,
        prepTime,
        cookTime,
        macros,
        calories,
        ingredients: ingredientsData,
        instructions,
        notes,
      });
      if (syncRecipes) syncRecipes();
      // Reset form
      setSelectedIngredients([]);
      setError(null);
    } catch (error) {
      setError(error.message);
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
          {/* Top Section: Photo + Recipe Info */}
          <div className="recipe-header-section">
            <label className="recipe-photo">
              Add Photo of Food
              <input type="file" name="image" />
            </label>

            <div className="recipe-basic-info">
              <label>
                Recipe Name:
                <input
                  type="text"
                  name="name"
                  placeholder="Enter recipe name"
                  required
                />
              </label>

              <label>
                Type of Cuisine:
                <input
                  type="text"
                  name="cuisine"
                  placeholder="e.g., Italian, Mexican"
                />
              </label>

              <div className="time-inputs-row">
                <label>
                  Prep Time (minutes):
                  <div className="time-input-wrapper">
                    <input
                      type="number"
                      name="prepTime"
                      min="0"
                      placeholder="15"
                      className="time-input"
                    />
                    <span className="time-unit">min</span>
                  </div>
                </label>

                <label>
                  Cook Time (minutes):
                  <div className="time-input-wrapper">
                    <input
                      type="number"
                      name="cookTime"
                      min="0"
                      placeholder="30"
                      className="time-input"
                    />
                    <span className="time-unit">min</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="ingredients-section">
            <label>Ingredients:</label>
            <Ingredients
              onAddIngredient={handleAddIngredient}
              selectedIngredients={selectedIngredients}
            />

            {/* Display added ingredients */}
            <div className="selected-ingredients">
              {selectedIngredients.map((ing, index) => (
                <div key={index} className="ingredient-item">
                  <span className="ingredient-name">{ing.name}</span>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={ing.amount}
                    onChange={(e) =>
                      handleIngredientChange(index, "amount", e.target.value)
                    }
                    className="ingredient-amount"
                  />
                  <input
                    type="text"
                    placeholder="Unit (cups, tbsp, etc.)"
                    value={ing.unit}
                    onChange={(e) =>
                      handleIngredientChange(index, "unit", e.target.value)
                    }
                    className="ingredient-unit"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="remove-ingredient"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

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
