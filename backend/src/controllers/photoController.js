const Photo = require("../models/Photo");
const Trip = require("../models/Trip");
const cloudinary = require("../config/cloudinary");
const archiver = require("archiver");
const axios = require("axios");


const uploadPhoto = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const isMember = trip.members.some(
      member => member.user.toString() === req.user.userId
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const photo = await Photo.create({
      trip: trip._id,
      uploadedBy: req.user.userId,
      imageUrl: req.file.path,
      cloudinaryId: req.file.filename,
    });

    res.status(201).json({
      message: "Photo uploaded successfully",
      photo,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTripPhotos = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const isMember = trip.members.some(
      member => member.user.toString() === req.user.userId
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const photos = await Photo.find({
      trip: trip._id,
    }).populate("uploadedBy", "name");

    res.json(photos);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.photoId);

    if (!photo) {
      return res.status(404).json({
        message: "Photo not found",
      });
    }

    const trip = await Trip.findById(photo.trip);

    const member = trip.members.find(
      member => member.user.toString() === req.user.userId
    );

    const isAdmin = member && member.role === "admin";
    const isUploader = photo.uploadedBy.toString() === req.user.userId;

    if (!isAdmin && !isUploader) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    await cloudinary.uploader.destroy(photo.cloudinaryId);

    await photo.deleteOne();

    res.json({
      message: "Photo deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const downloadAlbum = async (req, res) => {
  try {

    const photos = await Photo.find({
      trip: req.params.tripId,
    });

    res.attachment("album.zip");

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    archive.pipe(res);

    for (const photo of photos) {

      const response = await axios({
        method: "get",
        url: photo.imageUrl,
        responseType: "stream",
      });

      archive.append(
        response.data,
        {
          name:
            photo.cloudinaryId +
            ".jpg",
        }
      );
    }

    await archive.finalize();

  }catch (error) {

  console.log(error);

  res.status(500).json({
    message: error.message,
  });

}
};

module.exports = {
  uploadPhoto,
  getTripPhotos,
  deletePhoto,
  downloadAlbum,
};