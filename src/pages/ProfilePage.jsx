import { useState } from "react";
import { Link } from "react-router";
import CreateRecipe from "../profilepagecomponents/CreateRecipe.jsx";
import MyRecipes from "../profilepagecomponents/MyRecipes.jsx";
import ProfileInfo from "../profilepagecomponents/ProfileInfo.jsx";
import { useAuth } from "../Auth/Auth.jsx";

export default function ProfilePage() {
  const [showCreateRecipe, setShowCreateRecipe] = useState(false);
  const { token, user } = useAuth();

  return (
    <>
      <ProfileInfo
        showCreateRecipe={showCreateRecipe}
        setShowCreateRecipe={setShowCreateRecipe}
      />
      <div className="profile-content">
        {showCreateRecipe ? (
          token && user ? (
            <CreateRecipe />
          ) : (
            <div className="login-message">
              <p>
                Please <Link to="/register">create an account</Link> or{" "}
                <Link to="/login">log in</Link> to create recipes.
              </p>
            </div>
          )
        ) : (
          <MyRecipes />
        )}
      </div>
    </>
  );
}
