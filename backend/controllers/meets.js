/**
 * Adds a meet to the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with a success or error message.
 * Exports is a Node.js global object that contains all the exports from a file, usually functions to expose them to other
 * files that include this file. In this case, we are exporting the addMeet, deleteMeet, and getMeets functions so they can be used in other files.
 */

const meetModel = require("../models/meetModel");

exports.addMeet = async (req, res) => {
  // Extract data from the request body
  const {
    meetName,
    date,
    Throw1,
    Throw2,
    Throw3,
    Throw4,
    Throw5,
    Throw6,
    indoor,
    implement,
    comments,
  } = req.body;

  // Create a new meet object
  const meet = meetModel({
    meetName,
    date,
    Throw1,
    Throw2,
    Throw3,
    Throw4,
    Throw5,
    Throw6,
    indoor,
    implement,
    comments,
  });

  try {
    // Validations
    if (!meetName || !date || !indoor || !implement) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }
    if (Throw1 < 0 && Throw1 !== "") {
      return res
        .status(400)
        .json({ msg: "Distance 1 must be a positive number" });
    }
    if (Throw2 < 0 && Throw2 !== "") {
      return res
        .status(400)
        .json({ msg: "Distance 2 must be a positive number" });
    }

    if (Throw3 < 0 && Throw3 !== "") {
      return res
        .status(400)
        .json({ msg: "Distance 3 must be a positive number" });
    }

    if (Throw4 < 0 && Throw4 !== "") {
      return res
        .status(400)
        .json({ msg: "Distance 4 must be a positive number" });
    }

    if (Throw5 < 0 && Throw5 !== "") {
      return res
        .status(400)
        .json({ msg: "Distance 5 must be a positive number" });
    }

    if (Throw6 < 0 && Throw6 !== "") {
      return res
        .status(400)
        .json({ msg: "Distance 6 must be a positive number" });
    }

    // Save the meet to the database
    await meet.save();
    res.status(200).json({ msg: "Meet Added" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }

  console.log(meet);
};

/**
 * Retrieves all meets from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with an array of Meets or an error message.
 */
exports.getMeets = async (req, res) => {
  try {
    // Retrieve all meets from the database and sort them by createdAt in descending order
    const meets = await meetModel.find().sort({ createdAt: -1 });
    res.status(200).json(meets);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Deletes a meet from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with a success or error message.
 * exports function from the module so it can be used in other files.
 */
exports.deleteMeet = async (req, res) => {
  const { id } = req.params;
  console.log(req.params);

  // Find and delete the meet with the specified id
  meetModel
    .findByIdAndDelete(id)
    .then((meet) => {
      res.status(200).json({ msg: "Meet Deleted" });
    })
    .catch((err) => {
      res.status(500).json({ msg: err.message });
    });
};
