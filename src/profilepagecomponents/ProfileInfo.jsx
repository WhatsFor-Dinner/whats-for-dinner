import { useState } from "react";
import { NavLink } from "react-router";
import { useParams } from "react-router";

function ProfileInfo({ showCreateRecipe, setShowCreateRecipe }) {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <aside className="profile-sidebar">
        <div className="profile-header">
          <h2>Welcome </h2>

          <label
            className={`profile-photo-upload ${
              profileImage ? "has-image" : ""
            }`}
            style={
              profileImage ? { backgroundImage: `url(${profileImage})` } : {}
            }
          >
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {!profileImage && "Profile Picture"}
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
