import { useEffect, useState } from "react";


export default ProfilePage

const ProfilePage = () =>{
    return(
        <section className="profileNavigation">
            <nav>
                <picture>Profile Picture</picture>
                <button>My Recipes</button> 
                {/* has Favorites as a tab.  */}
                <button>Create Recipes</button>
                <button>My Table</button>
            </nav>
        </section>
            
    );

};