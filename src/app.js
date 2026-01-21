const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy'
  });
});

//parse incoming Json requests
app.use(express.json());

//parse URL-encoded data(from-submissions)
app.use(express.urlencoded({extended: true}))

//Base API routes
app.get("/api/v1",(req, res)=>{
  res.status(200).json({
    success:true,
    message:"Api is wokring fine"
  });
})

module.exports = app;