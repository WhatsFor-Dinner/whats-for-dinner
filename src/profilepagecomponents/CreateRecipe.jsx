import { useState } from "react";

function CreateRecipe() {
  
  
  
  function handleSubmit (e){
   e.preventDefault();

  }
  
  function handleChange (e){


  }


  return (
    <>
      <section className="create-recipe">
        <h2>Create A Recipe</h2>
        <form>
         
         <label className="recipe-photo">Add Photo of Food
          <input type="file" />
         </label>

          <div className="health-info">
            <label>
            Calorie total:
            <display type="text" name="recipe name" />
            <p>Protien:</p>
            <p>Carbs:</p>
            <p>Fats</p>
            <label>Numer of Servings:</label>
          </label>
          </div>
             <label>
            Chefs Rating: ???
            <display />
            </label>

         
          
          <label>
            Recipe Name:
            <input type="text" name="recipe name" />
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
            <input type="text" name="cook time" />
          </label>

          <label className="ingredient-add">
            Ingredients: {/*  type, add, press enter to add  */}
            <input type="text" name=" ingredients" />
            <button className="ingredient-add"> + </button>

          </label>

          <label>
            {" "}
            {/*  need to revisit */}
            Prep Instrutions:
            <ol>
              <li>Next step</li>
              <button>next </button>
            </ol>
          </label>
          <label>
           Chef's Note:
            <input type="text"  />
          </label>

         <section>
          <button className="form-button">Create</button>
          <button className="form-button"> Edit </button>
          <button className="form-button">Delete</button>
       </section> 
       </form>
       
      </section>
    </>
  );
};

export default CreateRecipe;
