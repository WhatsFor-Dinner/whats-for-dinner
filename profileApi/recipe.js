import { response } from "express";


const API  = notSureYet;

export async function getRecipes(){
    try {
        const response = await fetch (API + "/recipes");
        const result = await response.json();
        return result
        
    } catch (error) {
        console.error(e)
        return [];
        
    }
};

export async function getRecipes(id) {
    
    try {
        const response = await fetch (API + "/recipes/" + id);
        const result = await response.json();
        return result
        
    } catch (error) {
        console.error(error);
        return null;
        
    }
}

export async function createRecipe (token, recipe){
    if (!token) {
        throw Error("You must be logged in to create a recipe.");
        }
    const response =  await fetch(API +"/recipes", {
        method:"POST", 
        headers: {"Context type": "application/json",
        Authorization : "Bearer" + token,
        },
        body:JSON.stringify(recipe),
    })

        if (!response.ok) {
            const result = await response.json();

            throw Error (result.message)
        }
};


export async function deleteRecipe(token, id) {
    if (!token) {
        throw Error ("You must be logged in to delete a recipe. ");
    }
    const response = await fetch (API + "/recipes"+ id ,{
        method: "DELETE",
        headers: { Authorization: "Bearer" + token },

        
    });

    if (!response.ok) {
        const result = await response.json();
        throw Error (result.message);
    }
}