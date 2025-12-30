//requires 
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const colors = require("colors");

require('dotenv').config();

//instances
const app = express();

//express config
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Security headers - Basic implementation
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

//express routes
app.use("/api", require("./routes/devices.js"));
app.use("/api", require("./routes/users.js"));
app.use("/api", require("./routes/templates.js"));
app.use("/api", require("./routes/webhooks.js"));
app.use("/api", require("./routes/emqxapi.js"));
app.use("/api", require("./routes/alarms.js"));
app.use("/api", require("./routes/dataprovider.js"));
 
module.exports = app;

//listener
const API_PORT = process.env.API_PORT || 3001;
app.listen(API_PORT, () => {
  console.log("API server listening on port " + API_PORT);
});


if (process.env.SSLREDIRECT == "true"){

  const app2 = express();

  app2.listen(3002, function(){
    console.log("Listening on port 3002 (for redirect to ssl)");
  });
  
  app2.all('*', function(req, res){
    console.log("NO SSL ACCESS ... REDIRECTING...");
    return res.redirect("https://" + req.headers["host"] + req.url);
  });
}



//Mongo Connection
const mongoUserName = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const mongoDatabase = process.env.MONGO_DATABASE;

// Validate required environment variables
if (!mongoUserName || !mongoPassword || !mongoHost || !mongoDatabase) {
  console.error('FATAL ERROR: Missing required MongoDB environment variables'.red);
  process.exit(1);
}

var uri =
  "mongodb://" +
  mongoUserName +
  ":" +
  mongoPassword +
  "@" +
  mongoHost +
  ":" +
  mongoPort +
  "/" +
  mongoDatabase;

console.log('Connecting to MongoDB...'.yellow);

const options = {
  authSource: "admin",
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("\n");
    console.log("*******************************".green);
    console.log("✔ Mongo Successfully Connected!".green);
    console.log("*******************************".green);
    console.log("\n");
    if (typeof global.check_mqtt_superuser === 'function') {
      global.check_mqtt_superuser();
    }
  })
  .catch(err => {
    console.log("\n");
    console.log("*******************************".red);
    console.log("    Mongo Connection Failed    ".red);
    console.log("*******************************".red);
    console.log("\n");
    console.error(err);
    process.exit(1); // Exit on connection failure
  });

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:'.red, err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected'.yellow);
});

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination'.yellow);
    process.exit(0);
  } catch (err) {
    console.error('Error during graceful shutdown:'.red, err);
    process.exit(1);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

