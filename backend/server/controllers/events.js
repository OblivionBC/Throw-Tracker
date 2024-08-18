/*
  Purpose: Events.js holds all the HTTP Requests for editing the Event Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");

exports.addEvent = async (req, res) => {
  try {
    console.log(req.body);
    const {
      even_implement,
      even_attempt_one,
      even_attempt_two,
      even_attempt_thr,
      even_attempt_for,
      even_attempt_fiv,
      even_attempt_six,
      meet_rk,
    } = req.body;
    //$1 is the variable to add in the db, runs sql query in quotes which is same as in the CLI
    //Returning * returns back the data
    const newEvent = await pool.query(
      "INSERT INTO Event (even_implement, even_attempt_one, even_attempt_two, even_attempt_thr, even_attempt_for, even_attempt_fiv, even_attempt_six, meet_rk) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        even_implement,
        even_attempt_one,
        even_attempt_two,
        even_attempt_thr,
        even_attempt_for,
        even_attempt_fiv,
        even_attempt_six,
        meet_rk,
      ]
    );

    res.json(newEvent);
  } catch (err) {
    console.error(err.message);
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const allEvents = await pool.query("SELECT * FROM Event");
    res.json(allEvents);
  } catch (err) {
    console.log(err.message);
  }
};

exports.getEvent = async (req, res) => {
  try {
    const { Event_rk } = req.params;
    const Event = await pool.query("SELECT * FROM Event WHERE Event_rk = $1", [
      Event_rk,
    ]);

    res.json(Event.rows);
    console.log(req.params);
  } catch (err) {
    console.log(err.message);
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { Event_rk } = req.params;
    const {
      even_implement,
      even_attempt_one,
      even_attempt_two,
      even_attempt_thr,
      even_attempt_for,
      even_attempt_fiv,
      even_attempt_six,
      meet_rk,
    } = req.body;
    const updateTodo = await pool.query(
      "UPDATE Event SET even_implement = $1, even_attempt_one = $2, even_attempt_two = $3, even_attempt_thr = $4 , even_attempt_for = $5 , even_attempt_fiv = $6, even_attempt_six = $7, meet_rk = $8 WHERE Event_rk = $9",
      [
        even_implement,
        even_attempt_one,
        even_attempt_two,
        even_attempt_thr,
        even_attempt_for,
        even_attempt_fiv,
        even_attempt_six,
        meet_rk,
        Event_rk,
      ]
    );
    res.json("Event was Updated");
  } catch (err) {
    console.error(err.message);
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { event_rk } = req.params;
    const deleteEvent = await pool.query(
      "DELETE FROM Event WHERE Event_rk = $1",
      [event_rk]
    );

    res.json("Event has been Deleted");
  } catch (err) {
    console.log(err.message);
  }
};
