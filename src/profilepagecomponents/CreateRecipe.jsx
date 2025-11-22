import { useEffect, useId, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../Auth/Auth.jsx";
import { getIngredients, getIngredient } from "../profileApi/ingredients.js";
import { createRecipe } from "../profileApi/recipes.js";
import Ingredients from "./Ingredients.jsx";
import "./CreateRecipe.css";

function CreateRecipeCard({ syncRecipes }) {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [ingredient, setIngredient] = useState(null);
  const [error, setError] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [currentInstruction, setCurrentInstruction] = useState("");

  useEffect(() => {
    const syncIngredients = async () => {
      try {
        const data = await getIngredient(id);
        setIngredient(data);
      } catch (error) {
        setError(error.message);
      }
    };
    if (id) syncIngredients();
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

  const handleAddInstruction = () => {
    if (currentInstruction.trim()) {
      setInstructions([...instructions, currentInstruction]);
      setCurrentInstruction("");
    }
  };

  const handleRemoveInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleInstructionChange = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
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
    const notes = formData.get("notes");

    // Filter out empty instructions
    const cleanedInstructions = instructions.filter(
      (inst) => inst.trim() !== ""
    );

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
        instructions: cleanedInstructions,
        notes,
      });
      if (syncRecipes) syncRecipes();
      // Reset form
      setSelectedIngredients([]);
      setInstructions([]);
      setCurrentInstruction("");
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
                      placeholder=" "
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
                      placeholder=" "
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
                    step="0.01"
                    min="0"
                  />

                  <select
                    value={ing.unit}
                    onChange={(e) =>
                      handleIngredientChange(index, "unit", e.target.value)
                    }
                    className="ingredient-unit"
                  >
                    <option value="">Select unit</option>
                    <optgroup label="Volume">
                      <option value="tsp">teaspoon (tsp)</option>
                      <option value="tbsp">tablespoon (tbsp)</option>
                      <option value="fl oz">fluid ounce (fl oz)</option>
                      <option value="cup">cup</option>
                      <option value="pint">pint</option>
                      <option value="quart">quart</option>
                      <option value="gallon">gallon</option>
                      <option value="ml">milliliter (ml)</option>
                      <option value="l">liter (l)</option>
                    </optgroup>
                    <optgroup label="Weight">
                      <option value="oz">ounce (oz)</option>
                      <option value="lb">pound (lb)</option>
                      <option value="g">gram (g)</option>
                      <option value="kg">kilogram (kg)</option>
                    </optgroup>
                    <optgroup label="Quantity">
                      <option value="piece">piece</option>
                      <option value="whole">whole</option>
                      <option value="clove">clove</option>
                      <option value="slice">slice</option>
                      <option value="pinch">pinch</option>
                      <option value="dash">dash</option>
                      <option value="can">can</option>
                      <option value="package">package</option>
                      <option value="bunch">bunch</option>
                    </optgroup>
                    <optgroup label="Other">
                      <option value="to taste">to taste</option>
                      <option value="as needed">as needed</option>
                    </optgroup>
                  </select>
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

          <div className="instructions-section">
            <label>Prep Instructions:</label>

            {/* Display existing instructions */}
            {instructions.length > 0 && (
              <ol className="prep-instructions-list">
                {instructions.map((instruction, index) => (
                  <li key={index} className="instruction-item">
                    <textarea
                      value={instruction}
                      onChange={(e) =>
                        handleInstructionChange(index, e.target.value)
                      }
                      className="instruction-input"
                      placeholder={`Step ${index + 1}`}
                      rows="2"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveInstruction(index)}
                      className="remove-instruction"
                    >
                      X
                    </button>
                  </li>
                ))}
              </ol>
            )}

            {/* Add new instruction */}
            <div className="add-instruction">
              <textarea
                value={currentInstruction}
                onChange={(e) => setCurrentInstruction(e.target.value)}
                placeholder="Add instructions..."
                className="new-instruction-input"
                rows="2"
              />
              <button
                type="button"
                onClick={handleAddInstruction}
                className="add-instruction-btn"
              >
                + Add Step
              </button>
            </div>
          </div>

          <label className="chef-notes">
            Chef's Note:
            <input
              type="text"
              name="notes"
              placeholder="Add any special tips or notes..."
            />
          </label>

          {/* <div className="health-info">
            <label>
              <b>Calorie total: </b>
              <p type="text" name="recipe name"></p>
              <p>Protien:</p>
              <p>Carbs:</p>
              <p>Fats:</p>
              <span>Numer of Servings:</span>
            </label>
          </div> */}
          <section>
            <button type="submit" className="create-recipe-button">
              Create Recipe
            </button>
          </section>
        </form>
      </section>
    </>
  );
}

export default CreateRecipeCard;
