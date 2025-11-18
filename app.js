import express from "express";
const app = express();
export default app;

import getUserFromToken from "./src-backend/middleware/getUserFromToken.js";
import recipesRouter from "./src-backend/api/recipesAPI.js";
import profileRouter from "./src-backend/api/profileAPI.js";
import topTenRouter from "./src-backend/api/topTenAPI.js";
import ingredientsRouter from "./src-backend/api/ingredientsAPI.js";
import usersRouter from "./src-backend/api/users.js";

// Express body-parsing middleware. It tells Express to automatically read JSON data from the request body and turn it into a JavaScript object on req.body
app.use(express.json());

// This is authentication middleware that runs for every request.
app.use(getUserFromToken);

// Each one connects to a url path
app.use("/recipes", recipesRouter);
app.use("/profile", profileRouter);
app.use("/top-ten", topTenRouter);
app.use("/ingredients", ingredientsRouter);
app.use("/users", usersRouter);

// catches all errors that are not caught by error handlers in the router
// prevents server from exploding
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
