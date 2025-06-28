/*
  Purpose: Events routes for editing the Event table
*/

const router = require("express").Router();
const {
  addEvent,
  getEvent,
  getAllEvents,
  deleteEvent,
  updateEvent,
} = require("../controllers/events");

// RESTful routes
router
  .post("/", addEvent) // POST /events
  .get("/", getAllEvents) // GET /events
  .get("/:even_rk", getEvent) // GET /events/:even_rk
  .put("/:even_rk", updateEvent) // PUT /events/:even_rk
  .delete("/:even_rk", deleteEvent); // DELETE /events/:even_rk

module.exports = router;
