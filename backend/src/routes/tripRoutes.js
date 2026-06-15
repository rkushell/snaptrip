const express = require("express");
const router = express.Router();

const { createTrip, getMyTrips, updateTrip, deleteTrip, createInvite, joinTrip } = require("../controllers/tripController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware,createTrip);
router.get("/",authMiddleware,getMyTrips);
router.put("/:id",authMiddleware,updateTrip);
router.delete("/:id", authMiddleware, deleteTrip);
router.post("/:id/invite", authMiddleware, createInvite);
router.post("/join", authMiddleware, joinTrip);

module.exports = router;
