import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/conn.js";
import cookieParser from 'cookie-parser';
import cors from "cors";


dotenv.config();

connectDB();


const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());


import candidateRouter from "./routes/candidateRoute.js"
import userRouter from "./routes/userRoute.js"



app.use('/api/candidate', candidateRouter);
app.use("/api/user", userRouter);


const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
