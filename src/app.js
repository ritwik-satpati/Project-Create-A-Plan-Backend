import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import authRouter from "./routes/auth.routes.js";
import planRouter from "./routes/plan.routes.js";
import itineraryRouter from "./routes/itinerary.routes.js";

//routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/plan", planRouter);
app.use("/api/v1/itinerary", itineraryRouter);

export { app };
