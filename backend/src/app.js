const express = require("express");

const app = express();

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");

app.use(express.json());
app.get("/",function(req,res){
    res.json({message:"snaptrip api is running "});
});

app.use("/api/auth",authRoutes);
app.use("/api/trips",tripRoutes);

module.exports = app;