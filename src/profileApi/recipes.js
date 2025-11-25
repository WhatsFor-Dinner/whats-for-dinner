const API = "";

export async function getRecipes(token, userId) {
  try {
    const url = userId ? `${API}/recipes?userId=${userId}` : `${API}/recipes`;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(url, { headers });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getRecipe(id) {
  try {
    const response = await fetch(API + "/recipes/" + id);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createRecipe(token, recipe) {
  if (!token) {
    throw Error("You must be logged in to create a recipe.");
  }
  const response = await fetch(API + "/recipes/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(recipe),
  });

  if (!response.ok) {
    const result = await response.json();

    throw Error(result.message);
  }
}

export async function deleteRecipe(token, id) {
  if (!token) {
    throw Error("You must be logged in to delete a recipe. ");
  }
  const response = await fetch(API + "/recipes/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}

export async function updateRecipe(token, id, recipeData) {
  if (!token) {
    throw Error("You must be logged in to update a recipe.");
  }

  const response = await fetch(API + "/recipes/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(recipeData),
  });

  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }

  const result = await response.json();
  return result;
}

export async function getMyRecipes(token) {
  if (!token) {
    throw Error("You must be logged in to view your recipes.");
  }

  try {
    const response = await fetch(API + "/profile/my-recipes", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (response.status === 404) {
      return [];
    }
    if (!response.ok) {
      throw Error("Failed to fetch your recipes.");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getLikedRecipes(token) {
  if (!token) {
    throw Error("You must be logged in to view liked recipes.");
  }

  try {
    const response = await fetch(API + "/profile/liked-recipes", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      throw Error("Failed to fetch liked recipes.");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}
