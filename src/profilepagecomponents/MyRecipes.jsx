import { useState } from "react";

/* 


I want to have personally made recipes, saved recipies and favorite recipies. 
*/

function MyRecipes() {
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
      <p className={toggle === 1 ? "content active-content" : "content"}>
       
        This will display my created recipes and saved recipes.
      </p>
      <p className={toggle === 2 ? "content active-content" : "content"}>
       
        This will display favorited recipes.
      </p>
      </div>
    </section>
  );
}

export default MyRecipes;

{
  /* TODO: Add tabs for My Recipes and My Favorite Recipes 
  
  
  
  */
}
