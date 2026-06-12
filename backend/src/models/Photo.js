const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    cloudinaryId: {
      type: String,
      required: true,
    },

    captureDate: {
      type: Date,
      default: Date.now,
    },

    // AI fields (to be done later)
    category: {
      type: String,
      default: null,
    },

    tags: {
      type: [String],
      default: [],
    },

    duplicateGroup: {
      type: String,
      default: null,
    },

    qualityScore: {
      type: Number,
      default: null,
    },

    faces: {
      type: [String],
      default: [],
    },

    memoryCaption: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Photo", photoSchema);