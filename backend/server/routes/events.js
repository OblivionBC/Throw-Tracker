/*
  Purpose: Events routes for editing the Event table
*/

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  addEvent,
  getEvent,
  getAllEvents,
  deleteEvent,
  updateEvent,
} = require("../controllers/events");

// All event routes require authentication
router
  .post("/", requireAuth, addEvent) // POST /events
  .get("/", requireAuth, getAllEvents) // GET /events
  .get("/:even_rk", requireAuth, getEvent) // GET /events/:even_rk
  .put("/:even_rk", requireAuth, updateEvent) // PUT /events/:even_rk
  .delete("/:even_rk", requireAuth, deleteEvent); // DELETE /events/:even_rk

module.exports = router;
