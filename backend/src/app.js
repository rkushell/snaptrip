const express = require("express");

const app = express();

const authRoutes = require("./routes/authRoutes");

app.use(express.json());
app.get("/",function(req,res){
    res.json({message:"snaptrip api is running "});
});

app.use("/api/auth",authRoutes);

module.exports = app;