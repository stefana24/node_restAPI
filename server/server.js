import fetch from "node-fetch";
import express from "express";
// import TOKEN from "../token.js";
const TOKEN = process.env.TOKEN;
import { checkSchema, validationResult } from "express-validator";
import axios from "axios";

const app = express();

import bodyParser from "body-parser";
import cors from "cors";

app.use(cors());

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post(
  "/api/register",
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
        "https://gorest.co.in/public-api/users",
        req.body,
        {
          headers: {
            Authorization: "Bearer " + TOKEN,
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

// Endpoint to handle the GET request to fetch all users
app.get("/api/users", async (req, res) => {
  try {
    // Make a GET request to fetch all users
    const usersResponse = await axios.get(
      "https://gorest.co.in/public-api/users",
      {
        headers: {
          Authorization: "Bearer " + TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const users = usersResponse.data.data;
    console.log(users); // Display the users

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

app.listen(5000, () => console.log("Server started on port 5000"));
