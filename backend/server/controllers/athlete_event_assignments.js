const { pool } = require("../db");

// Production-safe logging
const isDevelopment = process.env.NODE_ENV === 'development';
const Logger = {
  log: (...args) => isDevelopment && console.log(...args),
  error: (...args) => isDevelopment && console.error(...args),
  warn: (...args) => isDevelopment && console.warn(...args),
  info: (...args) => isDevelopment && console.info(...args),
  debug: (...args) => isDevelopment && console.debug(...args),
  critical: (...args) => console.error(...args) // Always log critical errors
};


exports.assignEventToAthlete = async (req, res) => {
  try {
    const { athlete_rk, etyp_rk } = req.body;
    // Validate athlete exists
    const athleteCheck = await pool.query(
      "SELECT prsn_rk FROM person WHERE prsn_rk = $1",
      [athlete_rk]
    );
    if (athleteCheck.rows.length === 0) {
      return res.status(404).json({ message: "Athlete not found." });
    }
    // Validate event type exists
    const eventTypeCheck = await pool.query(
      "SELECT etyp_rk FROM event_type WHERE etyp_rk = $1",
      [etyp_rk]
    );
    if (eventTypeCheck.rows.length === 0) {
      return res.status(404).json({ message: "Event type not found." });
    }
    // Check if already assigned
    const exists = await pool.query(
      "SELECT * FROM athlete_event_assignment WHERE athlete_rk = $1 AND etyp_rk = $2",
      [athlete_rk, etyp_rk]
    );
    if (exists.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Event already assigned to athlete." });
    }
    const result = await pool.query(
      "INSERT INTO athlete_event_assignment (athlete_rk, etyp_rk) VALUES ($1, $2) RETURNING *",
      [athlete_rk, etyp_rk]
    );
    res.json(result.rows[0]);
  } catch (err) {
    Logger.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred assigning event to athlete." });
  }
};

exports.unassignEventFromAthlete = async (req, res) => {
  try {
    const { athlete_rk, etyp_rk } = req.body;
    const result = await pool.query(
      "DELETE FROM athlete_event_assignment WHERE athlete_rk = $1 AND etyp_rk = $2 RETURNING *",
      [athlete_rk, etyp_rk]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Assignment not found." });
    }
    res.json({ message: "Event unassigned from athlete." });
  } catch (err) {
    Logger.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred unassigning event from athlete." });
  }
};

exports.getEventsForAthlete = async (req, res) => {
  try {
    const { athlete_rk } = req.params;
    const result = await pool.query(
      `SELECT 
        aea.aevas_rk,
        aea.athlete_rk,
        aea.etyp_rk,
        et.etyp_type_name,
        et.event_group_name,
        et.description
       FROM athlete_event_assignment aea
       JOIN event_type et ON aea.etyp_rk = et.etyp_rk
       WHERE aea.athlete_rk = $1
       ORDER BY et.etyp_type_name`,
      [athlete_rk]
    );
    res.json(result.rows);
  } catch (err) {
    Logger.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred getting events for athlete." });
  }
};

exports.getAthletesForEvent = async (req, res) => {
  try {
    const { etyp_rk } = req.params;
    const result = await pool.query(
      `SELECT aea.*, p.* FROM athlete_event_assignment aea
       JOIN person p ON aea.athlete_rk = p.prsn_rk
       WHERE aea.etyp_rk = $1`,
      [etyp_rk]
    );
    res.json(result.rows);
  } catch (err) {
    Logger.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred getting athletes for event." });
  }
};
