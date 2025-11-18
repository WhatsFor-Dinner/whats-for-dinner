const API = "/api";

export async function getIngredients() {
  try {
    const response = await fetch(API + "/ingredients");
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getIngredient(id) {
  try {
    const response = await fetch(API + "/ingredients/" + id);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}
