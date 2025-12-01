const API = "";

// Helper function to safely parse response
async function parseResponse(response) {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  // If not JSON, return text
  const text = await response.text();
  return { error: text, message: text };
}

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

  // Check if recipe is FormData (for file uploads) or regular object
  const isFormData = recipe instanceof FormData;

  const headers = {
    Authorization: "Bearer " + token,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(API + "/recipes/create", {
    method: "POST",
    headers: headers,
    body: isFormData ? recipe : JSON.stringify(recipe),
  });

  if (!response.ok) {
    const result = await parseResponse(response);
    throw Error(result.message || result.error || "Failed to create recipe");
  }

  const result = await parseResponse(response);
  return result;
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
    const result = await parseResponse(response);
    throw Error(result.message || result.error || "Failed to delete recipe");
  }
}

export async function updateRecipe(token, id, recipeData) {
  if (!token) {
    throw Error("You must be logged in to update a recipe.");
  }

  // Check if recipeData is FormData (for file uploads) or regular object
  const isFormData = recipeData instanceof FormData;

  const headers = {
    Authorization: "Bearer " + token,
  };

  // Don't set Content-Type for FormData - browser will set it with boundary
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(API + "/recipes/" + id, {
    method: "PATCH",
    headers: headers,
    body: isFormData ? recipeData : JSON.stringify(recipeData),
  });

  if (!response.ok) {
    const result = await parseResponse(response);
    throw Error(result.message || result.error || "Failed to update recipe");
  }

  const result = await parseResponse(response);
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
