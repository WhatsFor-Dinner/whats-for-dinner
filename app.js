import express from "express";
const app = express();
export default app;

import getUserFromToken from "#middleware/getUserFromToken";
import ordersRouter from "#api/orders";
import productsRouter from "#api/products";
import usersRouter from "#api/users";

// Express body-parsing middleware. It tells Express to automatically read JSON data from the request body and turn it into a JavaScript object on req.body
app.use(express.json());

// This is authentication middleware that runs for every request.
app.use(getUserFromToken);

// Each one connects to a url path
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/users", usersRouter);

// catches all errors that are not caught by error handlers in the router
// prevents server from exploding
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
