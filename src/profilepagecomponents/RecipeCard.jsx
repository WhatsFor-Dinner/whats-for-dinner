import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  getRecipe,
  updateRecipe,
  deleteRecipe,
} from "../profileApi/recipe.jsx";
import { useAuth } from "../Auth/Auth.jsx";
import StarRating from "./StarRating";
import FavoriteButton from "./Favorite";

export default function RecipeCard() {
  const { token, currentUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(currentUser.id);

  useEffect(() => {
    if (currentUser) setUserId(currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    let isMounted = true;

    const syncRecipe = async () => {
      try {
        const data = await getRecipe(id);
        if (isMounted) {
          setRecipe(data);
        }
      } catch (e) {
        if (isMounted) {
          setError(e.message);
        }
      }
    };
    if (id) syncRecipe();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const tryDelete = async () => {
    try {
      await deleteRecipe(token, recipe.id);
      navigate(`/profilepage/${id}/recipes`);
    } catch (e) {
      setError(e.message);
    }
  };

  const tryUpdate = async () => {
    try {
      await updateRecipe(token, recipe.id);
      navigate(`/profilepage/${id}/recipes`);
    } catch (e) {
      setError(e.message);
    }
  };

  if (error) return <p>{error}</p>;

  if (!recipe) return <p>Loading Recipes...</p>;

  return (
    <section>
      {recipe.image && <img src={recipe.image} alt={recipe.name} />}
      <h1>{recipe.name}</h1>
      <p>{recipe.cuisine}</p>
      <p>{recipe.preTime}</p>
      <p>{recipe.cookTime}</p>
      <p>{recipe.ingredients}</p>
      <p>{recipe.measurements}</p>
      <p>{recipe.instructions}</p>
      <p>{recipe.notes}</p>
      {token && <button onClick={tryUpdate}>Update Recipe</button>}
      {token && <button onClick={tryDelete}>Delete Recipe</button>}
      {token && <StarRating />}
      {token && <FavoriteButton />}
    </section>
  );
}
