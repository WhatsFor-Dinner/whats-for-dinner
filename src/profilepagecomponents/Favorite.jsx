import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../Auth/Auth";
import Toast from "./Toast";

const API = import.meta.env.VITE_API_URL || "";

function LikeButton({ recipeId, initialLiked = false }) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [toast, setToast] = useState(null);
  const { token } = useAuth();

  const handleLike = async () => {
    if (!token) {
      setToast({ message: "Please register or log in to like recipes", type: "warning" });
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
      setToast({ message: "Failed to update liked status", type: "error" });
    }
  };

  return (
    <>
      <button
        className="like-button"
        onClick={handleLike}
        aria-label={
          isLiked ? "Remove from liked recipes" : "Add to liked recipes"
        }
      >
        {isLiked ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
      </button>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default LikeButton;
