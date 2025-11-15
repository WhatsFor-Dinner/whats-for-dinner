import { NavLink } from "react-router";

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
      </aside>
    </>
  );
}

export default ProfileInfo;
