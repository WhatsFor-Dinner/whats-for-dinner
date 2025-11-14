import CreateRecipe from "../profilepagecomponents/CreateRecipe.jsx";
import MyRecipes from "../profilepagecomponents/MyRecipes.jsx";
import MyTable from "../profilepagecomponents/MyTable.jsx";

export default function ProfilePage() {
  return (
    <>
      <section className="profile-navigation">
        <nav>
          <img input="file" alt="Profile Picture" />
          <button>My Recipes</button>

          <button>Create Recipes</button>
          <button>My Table</button>
        </nav>
      </section>
      <div>
        <CreateRecipe />
      </div>
      <div>
        <MyRecipes />
      </div>

      <div>
        <MyTable />
      </div>
    </>
  );
}
