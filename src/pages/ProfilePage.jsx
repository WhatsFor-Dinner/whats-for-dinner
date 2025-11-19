// import RecipeCard from "../profilepagecomponents/RecipeCard.jsx";
import CreateRecipe from "../profilepagecomponents/CreateRecipe.jsx";
import MyRecipes from "../profilepagecomponents/MyRecipes.jsx";
import ProfileInfo from "../profilepagecomponents/ProfileInfo.jsx";

export default function ProfilePage() {
  return (
    <>
      <ProfileInfo />
        <div className="profile-content">
        <MyRecipes />
        <CreateRecipe />
        {/* <RecipeCard/> */}
      </div>
    </>
  );
}
