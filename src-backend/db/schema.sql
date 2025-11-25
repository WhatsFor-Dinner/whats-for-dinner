DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS recipe_ingredients CASCADE;
DROP TABLE IF EXISTS liked_recipes CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  recipe_name TEXT NOT NULL, -- Not null because we need a name
  description TEXT NOT NULL, -- not null because we need an description of the recipe
  cuisine_type TEXT,
  difficulty TEXT NOT NULL, -- e.g. Easy, Medium, Hard
  chef_rating DECIMAL(2,1), -- Input would need to be a decimal for chef rating
  number_of_servings INTEGER NOT NULL,--Not null because we need to know how much the recipe yeilds
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  calories INTEGER,
  notes TEXT,
  instructions TEXT NOT NULL, -- Not null because instructions required
  picture_url TEXT -- store image URL or local path
);

CREATE TABLE ingredients (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE recipe_ingredients (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity NUMERIC(6,2),
  unit VARCHAR(20) -- e.g. 'grams', 'cups'
);

CREATE TABLE liked_recipes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  UNIQUE (user_id, recipe_id)  -- one liked recipe per user/recipe
);


