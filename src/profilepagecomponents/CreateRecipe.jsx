import { useEffect, useId, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useAuth } from "../Auth/Auth.jsx";
import { getIngredients, getIngredient } from "../profileApi/ingredients.js";
import {
  createRecipe,
  updateRecipe,
  getRecipe,
} from "../profileApi/recipes.js";
import Ingredients from "./Ingredients.jsx";
import "./CreateRecipe.css";

function CreateRecipeCard({ syncRecipes }) {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [ingredient, setIngredient] = useState(null);
  const [error, setError] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [currentInstruction, setCurrentInstruction] = useState("");
  const [existingRecipe, setExistingRecipe] = useState(null);

  // Check if we're in edit mode
  const isEditMode = location.pathname.includes("/edit");

  // Fetch existing recipe in edit mode
  useEffect(() => {
    let isMounted = true;

    const fetchExistingRecipe = async () => {
      if (!isEditMode || !id) return;

      try {
        const data = await getRecipe(id);
        if (isMounted) {
          setExistingRecipe(data);

          // Pre-populate ingredients
          if (data.ingredients && Array.isArray(data.ingredients)) {
            setSelectedIngredients(
              data.ingredients.map((ing) => ({
                id: ing.ingredientId,
                name: ing.name,
                amount: ing.quantity || "",
                unit: ing.unit || "",
              }))
            );
          }

          // Pre-populate instructions
          if (data.instructions) {
            const instructionsArray =
              typeof data.instructions === "string"
                ? data.instructions.split("\n").filter((i) => i.trim())
                : data.instructions;
            setInstructions(instructionsArray);
          }
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      }
    };

    fetchExistingRecipe();
    return () => {
      isMounted = false;
    };
  }, [id, isEditMode]);

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
    const description = formData.get("description");
    const difficulty = formData.get("difficulty");
    const servings = formData.get("servings");
    const prepTime = formData.get("prepTime");
    const cookTime = formData.get("cookTime");
    const calories = formData.get("calories");
    const notes = formData.get("notes");

  
    const cleanedInstructions = instructions.filter(
      (inst) => inst.trim() !== ""
    );
    const instructionsText = cleanedInstructions.join("\n");

    
    const ingredientsData = selectedIngredients.map((ing) => ({
      ingredientId: ing.id,
      name: ing.name,
      quantity: ing.amount || null,
      unit: ing.unit || null,
    }));

    try {
      const recipeData = {
        recipe_name: name,
        description: description,
        difficulty: difficulty,
        number_of_servings: parseInt(servings),
        cuisine_type: cuisine || null,
        prep_time_minutes: prepTime ? parseInt(prepTime) : null,
        cook_time_minutes: cookTime ? parseInt(cookTime) : null,
        calories: calories || null,
        notes: notes || null,
        instructions: instructionsText,
        picture_url: image || null,
        ingredients: ingredientsData,
      };

      if (isEditMode) {
        await updateRecipe(token, id, recipeData);
        navigate(`/recipe/${id}`);
      } else {
        await createRecipe(token, recipeData);
        if (syncRecipes) syncRecipes();
        // Reset form
        setSelectedIngredients([]);
        setInstructions([]);
        setCurrentInstruction("");
      }
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
        <h2>{isEditMode ? "Edit Recipe" : "Create A Recipe"}</h2>
        {error && <p className="error-message">{error}</p>}
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
                  defaultValue={existingRecipe?.recipe_name || ""}
                  required
                />
              </label>

              <label>
                Type of Cuisine:
                <input
                  type="text"
                  name="cuisine"
                  placeholder="e.g., Italian, Mexican"
                  defaultValue={existingRecipe?.cuisine_type || ""}
                />
              </label>

              <label>
                Description:
                <textarea
                  name="description"
                  placeholder="Brief description of the recipe"
                  rows="3"
                  defaultValue={existingRecipe?.description || ""}
                  required
                />
              </label>

              <div className="time-inputs-row">
                <label>
                  Difficulty:
                  <select
                    name="difficulty"
                    defaultValue={existingRecipe?.difficulty || ""}
                    required
                  >
                    <option value="">Select difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </label>

                <label>
                  Servings:
                  <input
                    type="number"
                    name="servings"
                    min="1"
                    placeholder="Number of servings"
                    defaultValue={existingRecipe?.number_of_servings || ""}
                    required
                  />
                </label>
              </div>

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
                      defaultValue={existingRecipe?.prep_time_minutes || ""}
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
                      defaultValue={existingRecipe?.cook_time_minutes || ""}
                    />
                    <span className="time-unit">min</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="ingredients-section">
            <label>Add Ingredients:</label>
            <Ingredients
              onAddIngredient={handleAddIngredient}
              selectedIngredients={selectedIngredients}
            />
          </div>

          <div className="selected-ingredients-section">
            <label>Selected Ingredients:</label>
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
                    </optgroup>
                    <optgroup label="Weight">
                      <option value="oz">ounce (oz)</option>
                      <option value="lb">pound (lb)</option>
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
              defaultValue={existingRecipe?.notes || ""}
            />
          </label>

          <section>
            <button type="submit" className="create-recipe-button">
              {isEditMode ? "Update Recipe" : "Create Recipe"}
            </button>
          </section>
        </form>
      </section>
    </>
  );
}

export default CreateRecipeCard;
