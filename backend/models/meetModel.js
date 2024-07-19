const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose");

const meetSchema = new mongoose.Schema(
  {
    meetName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 32,
    },
    Throw1: {
      type: Number,
      trim: true,
      maxLength: 4,
    },
    Throw2: {
      type: Number,
      trim: true,
      maxLength: 4,
    },
    Throw2: {
      type: Number,
      trim: true,
      maxLength: 4,
    },
    Throw4: {
      type: Number,
      trim: true,
      maxLength: 4,
    },
    Throw5: {
      type: Number,
      trim: true,
      maxLength: 4,
    },
    Throw6: {
      type: Number,
      trim: true,
      maxLength: 4,
    },
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    indoor: {
      type: Boolean,
      required: true,
      trim: true,
    },
    implement: {
      type: String,
      required: true,
      trim: true,
      maxLength: 16,
    },
    comments: {
      type: String,
      trim: true,
      maxLength: 100,
    },
  },
  //This is the option to include timestamps in the schema
  { timestamps: true }
);

module.exports = mongoose.model("Meets", meetSchema);
