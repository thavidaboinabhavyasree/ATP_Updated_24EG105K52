import exp from "express";
import { connect } from "mongoose";
import { empRoute } from "./API/empApp.js";
import cors from "cors";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const app = exp();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(exp.json());

app.use("/emp-api", empRoute);

const connectDB = async () => {
  try {
    const MONGODB_URI =
      process.env.MONGODB_URI ||
      "mongodb+srv://bhavya:bhavya_21@cluster0.pj596ob.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    await connect(MONGODB_URI);

    console.log("DB connected");

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
      console.log(`server listening on port ${PORT}..`);
    });

  } catch (err) {
    console.log("err in DB connection:", err.message);
  }
};

connectDB();

app.use((err, req, res, next) => {
  console.log("err in middleware:", err.message);

  res.status(err.status || 500).json({
    message: "error",
    reason: err.message,
  });
});