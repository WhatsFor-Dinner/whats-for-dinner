import { NavLink } from "react-router";
import { useParams } from "react-router";
 
function ProfileInfo({ showCreateRecipe, setShowCreateRecipe }) {
  

  return (
    <>
      <aside className="profile-sidebar">
        <div className="profile-header">
          <h2>Welcome  </h2>
          <label className="profile-photo-upload">
           Profile Picture
          </label>
        </div>

        <nav className="sidebar-navigation">
          <button
            onClick={() => setShowCreateRecipe(false)}
            className={!showCreateRecipe ? "active" : ""}
          >
            My Recipes
          </button>
          <button
            onClick={() => setShowCreateRecipe(true)}
            className={showCreateRecipe ? "active" : ""}
          >
            Create Recipes
          </button>
        </nav>
      </aside>
    </>
  );
}

export default ProfileInfo;
