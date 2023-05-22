import { checkSchema, validationResult } from "express-validator";
import express from "express";
import axios from "axios";
import {} from "dotenv/config";
const app = express();
app.use(express.json());

// // Configuring body parser middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

//register new user
app.post(
  "/users",
  checkSchema({
    email: {
      isEmail: {
        errorMessage: "Must be a valid e-mail address",
      },
    },
    name: { notEmpty: true },
    gender: { notEmpty: true },
    status: { notEmpty: true },
  }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      const errorMessages = errors.array();
      const registerResponse = await axios.post(
        "https://gorest.co.in/public/v2/users",
        req.body,
        {
          headers: {
            Authorization: "Bearer " + process.env.TOKEN,
            "Content-Type": "application/json",
          },
        }
      );

      const registeredUser = registerResponse.data.data;
      console.log(registeredUser);

      res.status(200).json({
        success: true,
        message: "User registered successfully",
        body: req.body,
        errors: errorMessages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  }
);

// get all users
app.get("/users", async (req, res) => {
  try {
    // Make a GET request to fetch all users
    const usersResponse = await axios.get(
      "https://gorest.co.in/public/v2/users",
      {
        headers: {
          Authorization: "Bearer " + process.env.TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const users = usersResponse.data.data;
    res.send(users);

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

//delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await axios.delete(`https://gorest.co.in/public/v2/users/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    });
    res.sendStatus(204); //no content
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      res.status(401).json({ error: "Invalid id" });
    } else if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "User not found." });
    } else {
      res.status(500).json({ error: "Failed to delete user." });
    }
  }
});

//create a new todo
app.post("/todos", async (req, res) => {
  try {
    const { title, status } = req.body;
    const response = await axios.post(
      "https://gorest.co.in/public/v2/todos",
      {
        title,
        completed: status === "pending",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
      }
    );
    res.status(201).json(response.data); //resource created
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

//get list of todos
app.get("/todos", async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const response = await axios.get("https://gorest.co.in/public/v2/todos", {
      params: {
        page,
        limit: pageSize,
      },
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch TODOs" });
  }
});

app.listen(5000, () => console.log("Server started on port 5000"));
