import { useState, useEffect } from "react";
import { useAuth } from "../Auth/Auth.jsx";
import { useParams } from "react-router";
import { Link } from "react-router";
import { getMyRecipes, getLikedRecipes } from "../profileApi/recipes.js";
import RecipeList from "./RecipeList.jsx";

function MyRecipes() {
  const { token, user } = useAuth();
  const [error, setError] = useState(null);
  const [myRecipes, setMyRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const getUserRecipes = async () => {
      if (!token || !user) return;

      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        const myRecipesData = await getMyRecipes(token);
        const likedRecipesData = await getLikedRecipes(token);

        if (isMounted) {
          setMyRecipes(myRecipesData);
          setFavoriteRecipes(likedRecipesData);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
          console.error("Error fetching recipes:", error);
          setMyRecipes([]);
          setFavoriteRecipes([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getUserRecipes();
    return () => {
      isMounted = false;
    };
  }, [token, user]);

  const [toggle, setToggle] = useState(1);
  function updateToggle(id) {
    setToggle(id);
  }

  return (
    <section className="my-recipes-containter">
      <div className="my-recipe-tabs">
        <button
          className={toggle === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => updateToggle(1)}
        >
          My Recipes
        </button>

        <button
          className={toggle === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => updateToggle(2)}
        >
          Favorite Recipes
        </button>
      </div>

      <div className="content-tabs">
        <div className={toggle === 1 ? "content active-content" : "content"}>
          {!token || !user ? (
            <div className="login-message">
              <p>
                Please <Link to="/register">create an account</Link> or{" "}
                <Link to="/signin">log in</Link> to create and view your
                recipes.
              </p>
            </div>
          ) : loading ? (
            <p>Loading your recipes...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : myRecipes.length === 0 ? (
            <p>
              You haven't created any recipes yet. Click "Create Recipe" to get
              started!
            </p>
          ) : (
            <RecipeList recipes={myRecipes} />
          )}
        </div>

        <div className={toggle === 2 ? "content active-content" : "content"}>
          {!token || !user ? (
            <div className="login-message">
              <p>
                Please <Link to="/register">create an account</Link> or{" "}
                <Link to="/signin">log in</Link> to favorite recipes.
              </p>
            </div>
          ) : loading ? (
            <p>Loading your favorite recipes...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : favoriteRecipes.length === 0 ? (
            <p>
              You haven't favorited any recipes yet. Start exploring recipes to
              add to your favorites!
            </p>
          ) : (
            <RecipeList recipes={favoriteRecipes} />
          )}
        </div>
      </div>
    </section>
  );
}

export default MyRecipes;
