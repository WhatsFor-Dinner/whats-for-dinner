import { useState, useEffect } from 'react';
import './home.css';


const Home = ({ searchTerm = '', onSearchChange = () => {} }) => {
  const [topRecipes, setTopRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  // Use local data (no backend). Simulate a short load for UX.
  useEffect(() => {
    const t = setTimeout(() => {
      setTopRecipes(topRecipesData.recipes || []);
      setFilteredRecipes(topRecipesData.recipes || []);
      setLoading(false);
    }, 150);
    return () => clearTimeout(t);
  }, []);

  // Filter recipes based on search term (from navbar)
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRecipes(topRecipes);
    } else {
      const filtered = topRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  }, [searchTerm, topRecipes]);

  return (
    <div className="home">
      <h1>Welcome to What's for Dinner?</h1>
      <div className="about">
        <h2>About Us</h2>
        <p>
          Welcome to What's For Dinner, do you ever wonder what to cook? look no
          further! This application will show you our top recipes to cook. you
          can also search for recipes based on your appetite.
        </p>
      </div>
      {loading ? (
        <p>Loading top recipes...</p>
      ) : filteredRecipes.length > 0 ? (
        <ul>
          {filteredRecipes.map((recipe) => (
            <li key={recipe.id}>{recipe.name}</li>
          ))}
        </ul>
      ) : (
        <p className="no-results">No recipes found matching '{searchTerm}'</p>
      )}
    </div>
  );
};

export default Home;
