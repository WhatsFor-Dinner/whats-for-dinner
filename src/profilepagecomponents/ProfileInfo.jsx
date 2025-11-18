import { NavLink } from "react-router";
import FavoriteButton from "./Favorite";
import StarRating from "../profilepagecomponents/StarRating";
function ProfileInfo() {
  return (
    <>
      <aside className="profile-sidebar">
        <div className="profile-header">
          <h2>Welcome UserName</h2>
          <label className="profile-photo-upload">
            Add Profile Picture
            <input type="file" />
          </label>
        </div>

        <nav className="sidebar-navigation">
          <button>My Recipes</button>
          <button>Create Recipes</button>
          <button>My Table</button>
        </nav>
        <FavoriteButton/>
        <StarRating/>
      </aside>
     
    </>
  );
}

export default ProfileInfo;
