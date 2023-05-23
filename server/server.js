import { checkSchema, validationResult } from "express-validator";
import express from "express";
import axios from "axios";
import {} from "dotenv/config";
const app = express();
app.use(express.json());

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

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await axios.delete(`https://gorest.co.in/public/v2/users/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Invalid id" });
  }
});

app.post("/users/:id/todos", async (req, res) => {
  try {
    const { title, status } = req.body;
    const user = req.params.id;
    const response = await axios.post(
      `https://gorest.co.in/public/v2/users/${user}/todos`,
      {
        title,
        status,
        user,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
      }
    );
    res.status(201).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.response.data });
  }
});

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
