const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const authRoute = require("./routes/authRoute");

app.use(bodyParser.json());
app.use("/auth", authRoute);
module.exports = app;
