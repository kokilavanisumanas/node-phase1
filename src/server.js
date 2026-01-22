import dotenv from 'dotenv';

dotenv.config();

import app from "./app.js";

import connectDB from './config/db.js';

import mongoose from 'mongoose';

const PORT = process.env.PORT || 3000;

let server;

// Connect to MongoDB
connectDB();

server = app.listen(PORT, ()=> {
    console.log("server is running on port" + `${PORT}`);
})

process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing MongoDB connection...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await mongoose.connection.close();
  server.close(() => {
    process.exit(0);
  });
});
