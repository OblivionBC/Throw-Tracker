const express = require("express"); // Importing the express module
const cors = require("cors"); // Importing the cors module
require("dotenv").config();

const app = express(); // Creating an instance of the express application
const db = require("./db/db"); // Importing the database module
const { readdirSync } = require("fs"); // Importing the readdirSync function from the fs module

const transactionsRouter = require("./routes/transactions"); // Importing the transactions router module
require("dotenv").config(); // Loading environment variables from a .env file
const PORT = process.env.REACT_APP_PORT; // Getting the port number from the environment variables

// Middleware
app.use(express.json()); // Parsing incoming requests with JSON payloads
app.use(cors()); // Enabling Cross-Origin Resource Sharing (CORS)

// Reads contents of routes directory and loads an array of filenames in directory
// For each filename in the array, it requires the file and attaches it to the app using .map (basically a for loop)
readdirSync("./routes").map((route) =>
  app.use("/api/v1", require("./routes/" + route))
);
// Dynamically loading all route modules from the "./routes" directory and attaching them to the "/api/v1" path

app.get("/", (req, res) => {
  res.send("Hola!"); // Sending a response with the string "Hola!"
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`); // Logging a message to the console
  db.db(); // Calling the db function from the db module
});
