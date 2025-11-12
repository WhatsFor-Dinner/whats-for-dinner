import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const [topRecipes, setTopRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopRecipes();
  }, []);

  const fetchTopRecipes = async () => {
    try {
      const response = await fetch('/api/top-recipes');
      if (!response.ok) {
        throw new Error('Failed to fetch top recipes');
      }
      const data = await response.json();
      setTopRecipes(data.recipes);
    } catch (error) {
      console.error('Error fetching top recipes:', error);
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <div className="home">
      <h1>Welcome to What's for Dinner?</h1>
      <h2>About Us</h2>
      <p>Welcome to What's For Dinner, do you ever wonder what to cook? look no further! This application will show you our top recipes to cook. 
        you can also search for recipes based on your appetite.
      </p>
      {loading ? (
        <p>Loading top recipes...</p>
      ) : (
        <ul>
          {topRecipes.map((recipe) => (
            <li key={recipe.id}>{recipe.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;