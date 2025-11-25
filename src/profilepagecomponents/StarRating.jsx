import { useState } from "react";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { useAuth } from "../Auth/Auth";

const API = import.meta.env.VITE_API_URL || "";

function StarRating({
  recipeId,
  initialRating = 0,
  totalStars = 5,
  onRatingSubmit,
}) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const { token } = useAuth();

  const handleClick = async (event, index) => {
    const starWidth = event.currentTarget.offsetWidth;
    const clickX = event.nativeEvent.offsetX;
    const halfStarThreshold = starWidth / 2;

    let newRating;
    if (clickX <= halfStarThreshold) {
      newRating = index + 0.5;
    } else {
      newRating = index + 1;
    }

    setRating(newRating);

    // Submit the rating to the backend
    if (recipeId && token) {
      await submitRating(newRating);
    }
  };

  const handleMouseMove = (event, index) => {
    const starWidth = event.currentTarget.offsetWidth;
    const clickX = event.nativeEvent.offsetX;
    const halfStarThreshold = starWidth / 2;

    if (clickX <= halfStarThreshold) {
      setHoverRating(index + 0.5);
    } else {
      setHoverRating(index + 1);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const submitRating = async (newRating) => {
    try {
      const response = await fetch(`${API}/recipes/${recipeId}/rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: newRating }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit rating");
      }

      const data = await response.json();

      if (onRatingSubmit) {
        onRatingSubmit(newRating, data);
      }

      return data;
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again.");
      // Optionally revert the rating on error
      setRating(initialRating);
    }
  };

  return (
    <section className="star-rating-container">
      {[...Array(totalStars)].map((_, index) => {
        const currentRating = hoverRating || rating;
        const isFull = currentRating >= index + 1;
        const isHalf =
          currentRating >= index + 0.5 && currentRating < index + 1;

        return (
          <div
            key={index}
            className="star-wrapper"
            onClick={(e) => handleClick(e, index)}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={handleMouseLeave}
          >
            {isFull ? (
              <span className="star-filled">
                <BsStarFill />
              </span>
            ) : isHalf ? (
              <span className="star-half-filled">
                <BsStarHalf />
              </span>
            ) : (
              <span className="star-empty">
                <BsStarFill />
              </span>
            )}
          </div>
        );
      })}
    </section>
  );
}

export default StarRating;
