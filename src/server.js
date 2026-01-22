const dotenv = require('dotenv');

dotenv.config();

app = require("./app");

const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.listen(PORT, ()=> {
    console.log("server is running on port" + `${PORT}`);
})

process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing MongoDB connection...');
  await require('mongoose').connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await require('mongoose').connection.close();
  server.close(() => {
    process.exit(0);
  });
});
