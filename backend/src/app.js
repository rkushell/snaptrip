const express = require("express");
const app = express();
app.use(express.json());
app.get("/",function(req,res){
    res.json({message:"snaptrip api is running "});
});

module.exports = app;