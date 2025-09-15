const { pool } = require(".././db");
const {
  NotFoundError,
  ValidationError,
  ConflictError,
} = require("../utils/errors");
const asyncHandler = require("../utils/asyncHandler");

exports.getAllEventTypes = asyncHandler(async (req, res) => {
  const result = await pool.query("SELECT * FROM event_type ORDER BY etyp_rk");
  res.json(result.rows);
});

exports.getEventTypeById = asyncHandler(async (req, res) => {
  const { etyp_rk } = req.params;
  const result = await pool.query(
    "SELECT * FROM event_type WHERE etyp_rk = $1",
    [etyp_rk]
  );
  if (result.rows.length === 0) {
    throw new NotFoundError("Event type");
  }
  res.json(result.rows[0]);
});
