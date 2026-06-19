const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const photoRoutes = require("./routes/photoRoutes");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.get("/",function(req,res){
    res.json({message:"snaptrip api is running "});
});

app.use("/api/auth",authRoutes);
app.use("/api/trips",tripRoutes);
app.use("/api/photos", photoRoutes);

module.exports = app;