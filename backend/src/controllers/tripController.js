const Trip = require("../models/Trip");
const { nanoid } = require("nanoid");
const Invite = require("../models/Invite");

const createTrip = async (req, res) =>{
    try{
        const { title, description } = req.body;

        const trip = await Trip.create({
            title,
            description,
            owner: req.user.userId,
            members: [
                {
                    user: req.user.userId,
                    role:"admin",
                },
            ],
        });

        res.status(201).json({
          message: "trip created successfully",
          trip,  
        });
    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
};

const getMyTrips = async (req,res) =>{
    try{
        const trips = await Trip.find({
            "members.user": req.user.userId,
        });
        res.json(trips);
    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateTrip = async (req,res) =>{
    try{
        const { title, description } = req.body;

        const trip = await Trip.findById(req.params.id);

        if(!trip){
            return res.status(404).json({
                message: "Trip not found",
            });
        }

        if(trip.owner.toString() !== req.user.userId){
            return res.status(403).json({
                message: "access denied",
            });
        }

        trip.title = title || trip.title;
        trip.description = description || trip.description;

        await trip.save();

        res.json({
            message: "trip updated successfully",
            trip,
        });
    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    if (trip.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    await trip.deleteOne();

    res.json({
      message: "Trip deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createInvite = async (req,res) =>{
    try{
        const trip = await Trip.findById(req.params.id);
        if(!trip){
            return res.status(404).json({
                message: "trip not found",
            });
        }
        if(trip.owner.toString() !== req.user.userId){
            return res.status(403).json({
                message: "access denied",
            });
        }

        const invite = await Invite.create({
            trip: trip._id,
            code: nanoid(6),
            createdBy: req.user.userId,
        });

        res.status(201).json({
            "message":"invite created successfully",
            invite,
        });
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
};

const joinTrip = async (req,res) =>{
    try{
        const { code } = req.body;

        const invite = await Invite.findOne({
            code,
            isActive: true,
        });

        if(!invite){
            return res.status(404).json({
                message: "Invalid invite code",
            });
        }

        const trip = await Trip.findById(invite.trip);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found",
            });
        }

        if (
            trip.members.some(
                member => member.user.toString() === req.user.userId
            )
        ){
            return res.status(400).json({
                message:"already a member of this trip",
            });
        }

        trip.members.push({
            user: req.user.userId,
            role: "member",
        });

        await trip.save();

        res.json({
            message:"joined trip successfully",
            trip,
        });
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
};

module.exports = {
    createTrip,
    getMyTrips,
    updateTrip,
    deleteTrip,
    createInvite,
    joinTrip,
};