 import React from "react";

 export default CreateRecipe;

 const CreateRecipe = () => {
   return (
     <>
       <h2>Create A Recipe</h2>
       <form>
         <label>
           Recipe Name:
           <input type="text" name="recipe name" />
         </label>
         <label>
             Add Photo of Food
         </label>
         <label>
           Type of Cuisine:
           <input type="text" name="cuisine" />
         </label>
         <label>
           Prep Time:
           <input type="text" name="prep" />
         </label>
         <label>
           Cook Time: {/* Cook Time: I want time in mins */}
           <input type="text" name="recipe name" />
         </label>
         <label>
           Ingrediants: {/*  type, add, press enter to add  */}
           <input type="text" name="recipe name" />
         </label>

         <label>
           {" "}
           {/*  need to revisit */}
           Prep Instrutions:
           <ol></ol>
         </label>
         <span> Calorie total</span>
         <span>Chefs Rating</span>
       </form>
     </>
   );
};

// review fit trackr progress form designs
