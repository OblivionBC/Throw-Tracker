//This imports functions from specified file by requiring the file
const { addMeet, getMeets, deleteMeet } = require("../controllers/meets");
const {
  addPractice,
  getPractices,
  deletePractice,
} = require("../controllers/practices");

//This creates a Node.js router object which is used to define routes
const router = require("express").Router();

/*
A route represents a specific URL or path in the application. 
It defines the combination of an HTTP method (such as GET, POST, DELETE, etc.) and a URL pattern that the server should respond to. 
When a client makes a request to a specific route, the router directs the request 
to the appropriate handler function associated with that route.
*/
router
  .post("/add-practice", addPractice)
  .get("/get-practices", getPractices)
  .delete("/delete-practice/:id", deletePractice)
  .post("/add-meet", addMeet)
  .get("/get-meets", getMeets)
  .delete("/delete-meet/:id", deleteMeet);
module.exports = router;
