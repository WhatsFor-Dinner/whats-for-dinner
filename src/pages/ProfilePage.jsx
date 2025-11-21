import { useState } from "react";

import CreateRecipe from "../profilepagecomponents/CreateRecipe.jsx";
import MyRecipes from "../profilepagecomponents/MyRecipes.jsx";
import ProfileInfo from "../profilepagecomponents/ProfileInfo.jsx";

export default function ProfilePage() {
  const [showCreateRecipe, setShowCreateRecipe] = useState(false);

  return (
    <>
    
      <ProfileInfo
        showCreateRecipe={showCreateRecipe}
        setShowCreateRecipe={setShowCreateRecipe}
      />
      <div className="profile-content">
        {showCreateRecipe ? <CreateRecipe /> : <MyRecipes />}
      </div>
      </>
  );
}
