import { useState } from "react";
import { BsStarFill, BsStarHalf } from "react-icons/bs";

function StarRating({ initialRating = 0, totalStars = 5 }) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (event, index) => {
    const starWidth = event.currentTarget.offsetWidth;
    const clickX = event.nativeEvent.offsetX;
    const halfStarThreshold = starWidth / 2;

    if (clickX <= halfStarThreshold) {
      setRating(index + 0.5); 
    } else {
      setRating(index + 1); 
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
            {/* Render your star icons/elements with conditional styling */}
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
