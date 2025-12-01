import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fileUpload from "express-fileupload";

const app = express();
export default app;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import getUserFromToken from "./src-backend/middleware/getUserFromToken.js";
import recipesRouter from "./src-backend/api/recipesAPI.js";
import profileRouter from "./src-backend/api/profileAPI.js";
import topTenRouter from "./src-backend/api/topTenAPI.js";
import ingredientsRouter from "./src-backend/api/ingredientsAPI.js";
import usersRouter from "./src-backend/api/usersAPI.js";

// Express body-parsing middleware. It tells Express to automatically read JSON data from the request body and turn it into a JavaScript object on req.body
app.use(express.json());

// File upload middleware for handling multipart/form-data
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  })
);

// Serve static files from dist folder in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));
}

// This is authentication middleware that runs for every request.
app.use(getUserFromToken);

// Each one connects to a url path
app.use("/recipes", recipesRouter);
app.use("/profile", profileRouter);
app.use("/top-ten", topTenRouter);
app.use("/ingredients", ingredientsRouter);
app.use("/users", usersRouter);

// Serve index.html for all other routes (SPA fallback) in production
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

// catches all errors that are not caught by error handlers in the router
// prevents server from exploding
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
