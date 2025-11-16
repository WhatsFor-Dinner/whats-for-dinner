import CreateRecipe from "../profilepagecomponents/CreateRecipe.jsx";
import MyRecipes from "../profilepagecomponents/MyRecipes.jsx";
import MyTable from "../profilepagecomponents/MyTable.jsx";
import ProfileInfo from "../profilepagecomponents/ProfileInfo.jsx";
import StarRating from "../profilepagecomponents/StarRating";
export default function ProfilePage() {
  return (
    <>
      <ProfileInfo />
      <div className="profile-content">
        <MyRecipes />
        <CreateRecipe />
        
        <MyTable />
      </div>
    </>
  );
}
