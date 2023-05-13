import fetch from "node-fetch";
import express from "express";
// import TOKEN from "../token.js";
const TOKEN =
  "845de8800d3d43db3b801019e45ed305b5c49183d14174d0c0c6da0e966bf2b1";
import { checkSchema } from "express-validator";
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

app.get("/users", async (req, res) => {
  const response = await fetch(
    "https://gorest.co.in/public/v2/users?page=1&per_page=20"
  );
  const users = await response.json();
  res.send({ users: users });
});

app.get("/add_user", (req, res) => {
  res.sendFile(__dirname + "/newUser.html");
});

app.post(
  "/add_user",
  checkSchema({
    email: { isEmail: true, notEmpty: true },
    name: { notEmpty: true },
    gender: { notEmpty: true },
    status: { notEmpty: true },
  }),
  async (req, res) => {
    try {
      // Make a POST request to the API
      const response = await axios.post(
        "https://gorest.co.in/public/v2/users",
        req.body,
        {
          headers: {
            Authorization: "Bearer " + TOKEN,
            "Content-Type": "application/json",
          },
        }
      );

      // Handle the response from the API
      console.log(response.data); // Do something with the response

      // Send a response back to the client
      res
        .status(200)
        .json({ success: true, message: "POST request sent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  }
);

app.post("/api/register", async (req, res) => {
  try {
    // Make a POST request to register a user
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
    console.log(registeredUser); // Display the registered user

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: registeredUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

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
