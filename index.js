const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const user = require("./routes/user");
const auth = require("./routes/auth");
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors');
const {logger} = require('./config/createLogger');

mongoose.connect("mongodb+srv://shobhit:shivamMongodb@loginappcluster.jebqbar.mongodb.net/?retryWrites=true&w=majority&appName=LoginAppCluster").then(() => {
    logger.log("info","connected to  mongodb...");
}).catch((err) => {
    logger.log("error",err.message);
})

app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.use("/api/users", user);
app.use("/api/auth", auth);

if (!config.get("jwtPrivateKey")) {
    console.log("FATAL ERROR: jwtPrivateKey not found...");
    logger.log("error","FATAL ERROR: jwtPrivateKey not found...");
    process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => logger.log("info",`listening to port ${port}`));
