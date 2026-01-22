import express from 'express';
const app = express();
import { userRoutes, authRoutes } from './routes/indexRoutes.js';
import errorHandler from './middlewares/errorMiddleware.js';

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

app.use('/api/v1', userRoutes);
app.use('/auth', authRoutes);

//Base API routes
app.get("/api/v1",(req, res)=>{
  res.status(200).json({
    success:true,
    message:"Api is wokring fine"
  });
})


// Error middleware (LAST)
app.use(errorHandler);

export default app;
