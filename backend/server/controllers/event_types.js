const { pool } = require(".././db");

exports.getAllEventTypes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM event_type ORDER BY etyp_rk"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred getting event types." });
  }
};

exports.getEventTypeById = async (req, res) => {
  try {
    const { etyp_rk } = req.params;
    const result = await pool.query(
      "SELECT * FROM event_type WHERE etyp_rk = $1",
      [etyp_rk]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Event type not found." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({ message: "Error occurred getting event type." });
  }
};
