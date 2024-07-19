const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose");

const practiceSchema = new mongoose.Schema(
  {
    block: {
      type: Number,
      trim: true,
      maxLength: 2,
    },
    session: {
      type: Number,
      trim: true,
      maxLength: 2,
    },
    standDistance: {
      type: Number,
      trim: true,
      maxLength: 4,
    },
    halfDistance: {
      type: Number,
      trim: true,
      maxLength: 4,
    },
    stepDistance: {
      type: Number,
      trim: true,
      maxLength: 4,
    },
    fullDistance: {
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

module.exports = mongoose.model("practices", practiceSchema);
