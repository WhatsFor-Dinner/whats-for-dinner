import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../Auth/Auth";

const API = import.meta.env.VITE_API_URL || "";

function FavoriteButton({ recipeId, initialFavorite = false }) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const { token } = useAuth();

  const handleFavorite = async () => {
    if (!token) {
      alert("Please log in to favorite recipes");
      return;
    }

    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);

    try {
      const response = await fetch(`${API}/favorites/${recipeId}`, {
        method: newFavorite ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }
    } catch (error) {
      console.error("Error updating favorite:", error);

      setIsFavorite(!newFavorite);
      alert("Failed to update favorite status");
    }
  };

  return (
    <button
      className="favorite-button"
      onClick={handleFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
    </button>
  );
}

export default FavoriteButton;
