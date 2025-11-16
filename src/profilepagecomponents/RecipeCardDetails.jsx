import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getRecipe, updateRecipe, deleteRecipe } from "..profileApi/recipe.jsx";
import { useAuth } from "..src/Auth/Auth.jsx";

function RecipeCardDetails(){
    const {token} = useAuth();
    const {id} = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState(null);
    
useEffect (()=> {
    const syncRecipe = async () => {
        const data = await getRecipe(id);
        setRecipe(data);
    };
    syncRecipe();
}, [id]);

const tryDelete = async () => {
    try {
        await deleteRecipe(token, recipe.id);
        navigate("/profilepage:id/recipes") //I have a question about this one i need to get back to the users profile page and back to the recipies that that have made.
        
    } catch (error) {
        setError(error.message)
    }
}

const tryUpdate = async () => {
    try {
        await updateRecipe(token, recipe.id);
        navigate("/profilepage:id/recipes") //I have a question about this one i need to get back to the users profile page and back to the recipies that that have made.
        

    } catch (error) {
        setError(error.message)
    }
    
}

if (!recipe) return <p> Loading Recipes...</p>;

    return (
        <section>
            <h2>{recipe.name}</h2>
        <p>{recipe.cuisine} </p>
         <p> </p>
          <p> </p>
           <p> </p>
            <p> </p>
             <p> </p>
              <p> </p>
               <p> </p>
               
               {token && <button onClick={tryUpdate}>Update Recipe</button>}
               {token && <button onClick={tryDelete}>Delete Recipe</button>}
               {/* {token && <button>Favorite heart</button>} */}
               {/* {token && <button>Rating</button>} */}
       </section>
   
   );
}

 export default RecipeCardDetails;