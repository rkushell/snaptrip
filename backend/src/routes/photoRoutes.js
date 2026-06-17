const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadPhoto, getTripPhotos, deletePhoto } = require("../controllers/photoController");

router.post(
  "/:tripId",
  authMiddleware,
  upload.single("image"),
  uploadPhoto
);

router.get("/:tripId", authMiddleware, getTripPhotos);

router.delete("/:photoId", authMiddleware, deletePhoto);

module.exports = router;