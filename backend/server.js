require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

require("./src/models/User");
require("./src/models/Trip");
require("./src/models/Photo");
require("./src/models/Invite");

const PORT = process.env.PORT || 5000;

connectDB().then(function(){
        app.listen(PORT, function(){
        console.log(`Server is running on port ${PORT}`);
    });
});