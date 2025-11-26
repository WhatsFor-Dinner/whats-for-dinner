import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../Auth/Auth";

const API = import.meta.env.VITE_API_URL || "";

function LikeButton({ recipeId, initialLiked = false }) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const { token } = useAuth();

  const handleLike = async () => {
    if (!token) {
      alert("Please log in to like recipes");
      return;
    }

    const newLiked = !isLiked;
    setIsLiked(newLiked);

    try {
      const response = await fetch(`${API}/recipes/${recipeId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update liked status");
      }

      const result = await response.json();
    
      setIsLiked(result.liked);
    } catch (error) {
      console.error("Error updating liked:", error);
      setIsLiked(!newLiked);
      alert("Failed to update liked status");
    }
  };

  return (
    <button
      className="like-button"
      onClick={handleLike}
      aria-label={
        isLiked ? "Remove from liked recipes" : "Add to liked recipes"
      }
    >
      {isLiked ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
    </button>
  );
}

export default LikeButton;
