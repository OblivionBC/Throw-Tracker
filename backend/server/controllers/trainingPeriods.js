/*
  Purpose: trainingPeriodss.js holds all the HTTP Requests for editing the TrainingPeriod Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");
const { TRPEDoesNotOverlap } = require("./rules");
const {
  NotFoundError,
  ValidationError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors");
const asyncHandler = require("../utils/asyncHandler");

exports.addTrainingPeriod = asyncHandler(async (req, res) => {
  const { trpe_start_dt, prsn_rk: targetPrsnRk } = req.body;
  const currentUserPrsnRk = req.user.id;

  if (!trpe_start_dt) {
    throw new ValidationError("Training period start date is required");
  }

  // Determine the target person ID
  let finalPrsnRk = targetPrsnRk || currentUserPrsnRk;

  // Get user info to check if current user is a coach
  const userCheck = await pool.query(
    "SELECT coach_prsn_rk FROM person WHERE prsn_rk = $1",
    [currentUserPrsnRk]
  );
  if (userCheck.rows.length === 0) {
    throw new NotFoundError("User");
  }

  // Authorization check
  let allowed = false;
  if (userCheck.rows[0].coach_prsn_rk) {
    // User is an athlete, can only create for themselves
    allowed = finalPrsnRk === currentUserPrsnRk;
  } else {
    // User is a coach, can create for themselves or their athletes
    if (finalPrsnRk === currentUserPrsnRk) {
      allowed = true;
    } else {
      // Check if target person is an athlete of this coach
      const athleteCheck = await pool.query(
        "SELECT prsn_rk FROM person WHERE prsn_rk = $1 AND coach_prsn_rk = $2",
        [finalPrsnRk, currentUserPrsnRk]
      );
      allowed = athleteCheck.rows.length > 0;
    }
  }

  if (!allowed) {
    throw new UnauthorizedError("Access denied");
  }

  const overlap = await TRPEDoesNotOverlap(trpe_start_dt, finalPrsnRk);
  if (!overlap.pass) {
    throw new ValidationError(overlap.message);
  }

  var newTrainingPeriod;

  console.log("Adding with End Date");
  newTrainingPeriod = await pool.query(
    "INSERT INTO training_period (trpe_start_dt, prsn_rk) VALUES($1, $2) RETURNING *",
    [trpe_start_dt, finalPrsnRk]
  );

  res.json(newTrainingPeriod.rows[0]);
  console.log("Adding Training Period for Person " + finalPrsnRk);
});

exports.getAllTrainingPeriods = asyncHandler(async (req, res) => {
  console.log(req.query);
  // Always use prsn_rk as input
  const user_prsn_rk = req.user.id;
  const prsn_rk = req.query.prsn_rk
    ? parseInt(req.query.prsn_rk, 10)
    : user_prsn_rk;

  // Get user info
  const userCheck = await pool.query(
    "SELECT coach_prsn_rk FROM person WHERE prsn_rk = $1",
    [user_prsn_rk]
  );
  if (userCheck.rows.length === 0) {
    throw new NotFoundError("User");
  }

  let allowed = false;
  if (userCheck.rows[0].coach_prsn_rk) {
    // User is an athlete, can only fetch their own periods
    allowed = prsn_rk === user_prsn_rk;
  } else {
    // User is a coach, can fetch their athletes' periods
    if (prsn_rk === user_prsn_rk) {
      allowed = true;
    } else {
      // Check if prsn_rk is an athlete of this coach
      const athleteCheck = await pool.query(
        "SELECT prsn_rk FROM person WHERE prsn_rk = $1 AND coach_prsn_rk = $2",
        [prsn_rk, user_prsn_rk]
      );
      allowed = athleteCheck.rows.length > 0;
    }
  }
  console.log(allowed);
  if (!allowed) {
    throw new UnauthorizedError("Access denied");
  }
  console.log(prsn_rk);
  // Always return only the periods for the specified prsn_rk
  const allTrainingPeriods = await pool.query(
    "SELECT * FROM training_period WHERE prsn_rk = $1 ORDER BY trpe_start_dt DESC",
    [prsn_rk]
  );
  console.log(allTrainingPeriods.rows);
  res.json(allTrainingPeriods.rows);
});

exports.getTrainingPeriod = asyncHandler(async (req, res) => {
  const { trpe_rk } = req.params;

  if (!trpe_rk) {
    throw new ValidationError("Training period ID is required");
  }

  const trainingPeriod = await pool.query(
    "SELECT * FROM training_period WHERE trpe_rk = $1",
    [trpe_rk]
  );

  if (trainingPeriod.rows.length === 0) {
    throw new NotFoundError("Training period");
  }

  res.json(trainingPeriod.rows[0]);
  console.log("Getting Training Period " + trpe_rk);
});

exports.endDateMostRecentTrainingPeriod = asyncHandler(async (req, res) => {
  const { trpe_end_dt } = req.body;
  const prsn_rk = req.user.id;

  if (!trpe_end_dt) {
    throw new ValidationError("Training period end date is required");
  }

  const TrainingPeriod = await pool.query(
    "UPDATE training_period SET trpe_end_dt = $1 WHERE trpe_rk = ( SELECT trpe_rk FROM training_period where prsn_rk = $2 ORDER BY trpe_start_dt DESC LIMIT 1)",
    [trpe_end_dt, prsn_rk]
  );

  res.json(TrainingPeriod.rows);
  console.log("End Dating Most Recent Training Period for person " + prsn_rk);
  console.log(TrainingPeriod.rows);
});

exports.updateTrainingPeriod = asyncHandler(async (req, res) => {
  const { trpe_rk, trpe_start_dt, trpe_end_dt } = req.body;
  const prsn_rk = req.user.id;

  if (!trpe_rk) {
    throw new ValidationError("Training period ID is required");
  }

  if (!trpe_start_dt) {
    throw new ValidationError("Training period start date is required");
  }

  if (!trpe_end_dt) {
    throw new ValidationError("Training period end date is required");
  }

  //First we want to check that the start date is not overlapped by an existing trpe
  let overlapStart = await TRPEDoesNotOverlap(trpe_start_dt, prsn_rk);
  if (!overlapStart.pass) {
    overlapStart.message += " for Start Date";
    throw new ValidationError(overlapStart.message);
  }
  //Next check if the end date is
  let overlapEnd = await TRPEDoesNotOverlap(trpe_end_dt, prsn_rk);
  if (!overlapEnd.pass) {
    overlapEnd.message += " for End Date";
    throw new ValidationError(overlapEnd.message);
  }
  const updateTodo = await pool.query(
    "UPDATE training_period SET trpe_start_dt = $1, trpe_end_dt = $2 WHERE trpe_rk = $3",
    [trpe_start_dt, trpe_end_dt, trpe_rk]
  );
  res.json("Training Period was Updated");
  console.log("Updating Training Period " + trpe_rk);
});

exports.deleteTrainingPeriod = asyncHandler(async (req, res) => {
  const { trpe_rk } = req.params;

  if (!trpe_rk) {
    throw new ValidationError("Training period ID is required");
  }

  const deleteTrainingPeriod = await pool.query(
    "DELETE FROM training_period WHERE trpe_rk = $1",
    [trpe_rk]
  );

  res.json("Training Period has been Deleted");
});
