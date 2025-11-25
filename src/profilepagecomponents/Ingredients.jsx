import { useState, useEffect } from "react";
import { searchIngredients } from "../profileApi/ingredients.js";
import "./Ingredients.css";

function Ingredients({ onAddIngredient, selectedIngredients = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounced search - waits 300ms after user stops typing
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchIngredients(searchTerm);
      setSearchResults(results);
      setShowDropdown(true);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelect = (ingredient) => {
    const isAlreadyAdded = selectedIngredients.some(
      (ing) => ing.id === ingredient.id
    );
    if (isAlreadyAdded) {
      alert(`${ingredient.name} is already in added!`);
      return;
    }

    onAddIngredient(ingredient);
    setSearchTerm("");
    setSearchResults([]);
    setShowDropdown(false);
  };

  const isIngredientSelected = (ingredientId) => {
    return selectedIngredients.some((ing) => ing.id === ingredientId);
  };

  return (
    <div className="ingredient-search">
      <div className="search-input-wrapper">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for ingredients..."
          className="ingredient-search-input"
        />
        {isSearching && (
          <span className="searching-indicator">Searching...</span>
        )}
      </div>

      {showDropdown && searchResults.length > 0 && (
        <ul className="ingredient-dropdown">
          {searchResults.map((ingredient) => {
            const isSelected = isIngredientSelected(ingredient.id);
            return (
              <li
                key={ingredient.id}
                onClick={() => handleSelect(ingredient)}
                className={`ingredient-option ${
                  isSelected ? "already-selected" : ""
                }`}
                title={isSelected ? "Already added" : ""}
              >
                {ingredient.name}
                {isSelected && <span className="selected-badge"> ✓ Added</span>}
              </li>
            );
          })}
        </ul>
      )}

      {showDropdown && searchResults.length === 0 && !isSearching && (
        <div className="no-results">No ingredients found</div>
      )}
    </div>
  );
}

export default Ingredients;
