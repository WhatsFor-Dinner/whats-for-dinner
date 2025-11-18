const API = "/api";

export async function getRecipes() {
  try {
    const response = await fetch(API + "/recipes");
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
  const response = await fetch(API + "/recipes", {
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
