/**
 * Adds a throw session to the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with a success or error message.
 * Exports is a Node.js global object that contains all the exports from a file, usually functions to expose them to other
 * files that include this file. In this case, we are exporting the addThrowSession function so it can be used in other files.
 */

const practiceModel = require("../models/practiceModel");

exports.addPractice = async (req, res) => {
  // Extract data from the request body
  const {
    block,
    session,
    standDistance,
    halfDistance,
    stepDistance,
    fullDistance,
    date,
    indoor,
    implement,
    comments,
  } = req.body;

  // Create a new throw session object
  const practice = practiceModel({
    block,
    session,
    standDistance,
    halfDistance,
    stepDistance,
    fullDistance,
    date,
    indoor,
    implement,
    comments,
  });

  try {
    // Validations
    if (!session || !date || !indoor || !implement) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }
    if (standDistance <= 0 && standDistance !== "") {
      return res
        .status(400)
        .json({ msg: "Stand Throw must be a positive number" });
    }
    if (halfDistance <= 0 && halfDistance !== "") {
      return res
        .status(400)
        .json({ msg: "Half Throw must be a positive number" });
    }
    if (stepDistance <= 0 && stepDistance !== "") {
      return res
        .status(400)
        .json({ msg: "Step Throw must be a positive number" });
    }
    if (fullDistance <= 0 && fullDistance !== "") {
      return res
        .status(400)
        .json({ msg: "Full Distance must be a positive number" });
    }

    // Save the throw session to the database
    await practice.save();
    res.status(200).json({ msg: "Practice Added" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }

  console.log(practice);
};

/**
 * Retrieves all throw sessions from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with an array of throw sessions or an error message.
 */
exports.getPractices = async (req, res) => {
  try {
    // Retrieve all throw sessions from the database and sort them by createdAt in descending order
    const practice = await practiceModel.find().sort({ createdAt: -1 });
    res.status(200).json(practice);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Deletes a throw session from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with a success or error message.
 * exports function from the module so it can be used in other files.
 */
exports.deletePractice = async (req, res) => {
  const { id } = req.params;
  console.log(req.params);

  // Find and delete the throw session with the specified id
  practiceModel
    .findByIdAndDelete(id)
    .then((practice) => {
      res.status(200).json({ msg: "Practice Deleted" });
    })
    .catch((err) => {
      res.status(500).json({ msg: err.message });
    });
};
