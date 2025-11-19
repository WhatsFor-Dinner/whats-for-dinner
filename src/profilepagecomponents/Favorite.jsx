import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function FavoriteButton() {
    const [isFavorite, setIsFavorite] = useState(false)
    const handleFavorite = () =>{
        setIsFavorite(!isFavorite)
    };

    return (
      
        <button className="favorite-button" onClick={handleFavorite} >
        {isFavorite ? <FaHeart color="red"/> : <FaRegHeart color=" "/>}
       
        </button>
    )
};

export default FavoriteButton;