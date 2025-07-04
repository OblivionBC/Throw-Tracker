/*
  Purpose: exercise_assignments.js holds all the HTTP Requests for editing the exercise_assignment Table
      The table is selected through the SQL Queries
*/
const { pool } = require(".././db");
const { addMeasurable } = require("./measurables");
exports.addExerciseAssignment = async (req, res) => {
  try {
    const {
      prog_rk,
      athlete_prsn_rk,
      exas_notes,
      excr_rk,
      exas_reps,
      exas_sets,
      exas_weight,
      is_measurable,
    } = req.body;
    const assigner_prsn_rk = req.user.id;
    let meas_rk = undefined;
    //Make a measurable for the person
    if (is_measurable === true) {
      const getExercise = await pool.query(
        "select * from exercise where excr_rk = $1",
        [excr_rk]
      );
      if (getExercise.rowCount <= 0) {
        return res.status(400).json({ message: "Cant find the exercise" });
      }

      //Check if measurable already exists, if it does link the rk, else make a new one
      const alreadyExists = await pool.query(
        "select meas_rk from measurable where meas_id = $1 and prsn_rk = $2",
        [getExercise.rows[0].excr_nm, athlete_prsn_rk]
      );

      if (alreadyExists.rowCount === 0) {
        //There is no existing Measurable, so create one
        console.log("Here Making New Measurable");
        const measurableResult = await addMeasurable(
          {
            body: {
              meas_id: getExercise.rows[0].excr_nm,
              meas_typ: getExercise.rows[0].excr_typ,
              meas_unit: getExercise.rows[0].excr_units,
              prsn_rk: athlete_prsn_rk,
            },
          },
          res
        );

        if (measurableResult.status !== 200) {
          return res
            .status(measurableResult.status)
            .json({ message: measurableResult.message });
        }

        meas_rk = measurableResult.data.rows[0].meas_rk;
      } else {
        meas_rk = alreadyExists.rows[0].meas_rk;
        console.log("Here Measurable Already Exists, made meas as " + meas_rk);
      }
    }
    let measure = "";
    is_measurable === true ? (measure = "Y") : (measure = "N");
    const newExercise = await pool.query(
      "INSERT INTO exercise_assignment (prog_rk, athlete_prsn_rk, assigner_prsn_rk, exas_notes, excr_rk, exas_reps, exas_sets, exas_weight, is_measurable, meas_rk ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        prog_rk,
        athlete_prsn_rk,
        assigner_prsn_rk,
        exas_notes,
        excr_rk,
        exas_reps,
        exas_sets,
        exas_weight,
        measure,
        meas_rk,
      ]
    );
    res.json(newExercise.rows[0]);
  } catch (err) {
    console.error("Async Error:", err.message);
    return res.status(500).json({ message: "Error occurred Adding Exercise." });
  }
};

exports.getExerciseAssignmentsInProgram = async (req, res) => {
  try {
    const { prog_rk } = req.body;
    const allExercises = await pool.query(
      "SELECT * FROM exercise_assignment exas join program prog on exas.prog_rk = prog.prog_rk where prog.prog_rk = prog_rk",
      [prog_rk]
    );
    res.json(allExercises.rows);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({
      message: "Error occurred Getting ExerciseAssignments from Program.",
    });
  }
};

exports.getProgramsAndExerciseForTRPE = async (req, res) => {
  try {
    const { trpe_rk } = req.body;
    const allExercises = await pool.query(
      "SELECT prog.prog_rk, prog.prog_nm, excr.excr_nm, exas.excr_rk, exas.exas_rk,exas.meas_rk, exas.exas_reps, exas.exas_sets, exas.exas_weight, excr.excr_notes,  exas.exas_notes, exas.is_measurable FROM program prog left join exercise_assignment exas on exas.prog_rk = prog.prog_rk left join exercise excr on excr.excr_rk = exas.excr_rk where prog.trpe_rk = $1",
      [trpe_rk]
    );
    res.json(allExercises.rows);
  } catch (err) {
    console.error("Async Error:", err.message);
    res.status(500).json({
      message: "Error occurred Getting ExerciseAssignments from Program.",
    });
  }
};

exports.getExerciseAssignment = async (req, res) => {
  try {
    const { exas_rk } = req.body;
    const ExerciseAssignment = await pool.query(
      "SELECT * FROM exercise_assignment WHERE exas_rk = $1",
      [exas_rk]
    );

    res.json(ExerciseAssignment.rows[0]);
    console.log(req.params);
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred Getting Exercise Assignment." });
  }
};

exports.updateExerciseAssignment = async (req, res) => {
  try {
    const {
      athlete_prsn_rk,
      exas_notes,
      exas_rk,
      excr_rk,
      exas_reps,
      exas_sets,
      exas_weight,
      is_measurable,
      add_measurable,
    } = req.body;
    let meas_rk = null;
    //Make a measurable for the person

    if (is_measurable === true && add_measurable === true) {
      const getExercise = await pool.query(
        "select * from exercise where excr_rk = $1",
        [excr_rk]
      );
      if (getExercise.rowCount <= 0) {
        return res.status(400).json({ message: "Cant find the exercise" });
      }
      //Check if measurable already exists, if it does link the rk, else make a new one
      const alreadyExists = await pool.query(
        "select meas_rk from measurable where meas_id = $1 and prsn_rk = $2",
        [getExercise.rows[0].excr_nm, athlete_prsn_rk]
      );
      if (alreadyExists.rowCount === 0) {
        //There is no existing Measurable, so create one
        const measurableResult = await addMeasurable(
          {
            body: {
              meas_id: getExercise.rows[0].excr_nm,
              meas_typ: getExercise.rows[0].excr_typ,
              meas_unit: getExercise.rows[0].excr_units,
              prsn_rk: athlete_prsn_rk,
            },
          },
          res
        );

        if (measurableResult.status !== 200) {
          return res
            .status(measurableResult.status)
            .json({ message: measurableResult.message });
        }
        meas_rk = measurableResult.data.rows[0].meas_rk;
      } else {
        meas_rk = alreadyExists.rows[0].meas_rk;
        console.log("Here Measurable Already Exists, made meas as " + meas_rk);
      }
    }
    let measure = "";
    is_measurable === true ? (measure = "Y") : (measure = "N");

    const updateTodo = await pool.query(
      "UPDATE exercise_assignment SET exas_notes = $1, excr_rk = $2, exas_reps= $4, exas_sets = $5, exas_weight = $6, is_measurable = $7, meas_rk = $8 WHERE exas_rk = $3",
      [
        exas_notes,
        excr_rk,
        exas_rk,
        exas_reps,
        exas_sets,
        exas_weight,
        measure,
        meas_rk,
      ]
    );
    res.json("ExerciseAssignment was Updated");
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred Updating ExerciseAssignment." });
  }
};

exports.deleteExerciseAssignment = async (req, res) => {
  try {
    const { exas_rk } = req.body;
    console.log("DELETING");
    console.log(req.body);
    const deleteExerciseAssignment = await pool.query(
      "DELETE FROM exercise_assignment WHERE exas_rk = $1",
      [exas_rk]
    );

    res.json("ExerciseAssignment has been Deleted");
  } catch (err) {
    console.error("Async Error:", err.message);
    res
      .status(500)
      .json({ message: "Error occurred Deleting ExerciseAssignment." });
  }
};
