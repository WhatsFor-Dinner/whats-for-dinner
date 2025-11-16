import express from "express";
const router = express.Router();
export default router;

import { createUser, getUserLoginInfo } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

router
  .route("/register")
  // sends 400 using the imported requireBody function if request body is missing username or password
  .post(requireBody(["username", "password"]), async (req, res) => {
    try {
      // destructure user and pass from the request body so I can use it in the createUser function
      // Side note: Use req.body if I need to destructure multipule parameters from the request body, but I can use req.param.foo if I only need to destructure a specific parameter. Destructuring must use curly brackets for valid pass through
      const { username, password } = req.body;
      const user = await createUser(username, password);

      // creates a new user with the provided credentials and sends a token
      // confirmed that password is hashed in DB
      const token = await createToken({ id: user.id });
      res.status(201).send(token);
    } catch (error) {
      next(error);
    }
  });

router
  .route("/login")
  // sends 400 using the imported requireBody function if request body is missing username or password
  .post(requireBody(["username", "password"]), async (req, res) => {
    try {
      const { username, password } = req.body;

      // uses the parameters from the request body to compare the request inputs to the DB and checks if there are matching credentials. The check will return 401 if the username or password do not match the credentials in the DB
      // getUserLoginInfo hashes the password
      const user = await getUserLoginInfo(username, password);
      if (!user) return res.status(401).send("Invalid username or password.");

      // sends a token if the provided credentials are valid
      const token = await createToken({ id: user.id });
      res.send(token);
    } catch (error) {
      next(error);
    }
  });
