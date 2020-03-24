const mongoose = require("mongoose");
const express = require("express");
const app = express();
const routes = require("./routes/routes");

const PORT = process.env.PORT || 3001;

// Connect to the Mongo DB

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/covid19-2";
mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true },
  console.log("Connected to MongoDB!")
);

// Define middleware here
// 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets (usually on heroku)
app.use(express.static("public"));

app.use(routes);

// Start the server
app.listen(PORT, function() {
  console.log(`🌎  ==> Server now listening on PORT ${PORT}!`);
});
