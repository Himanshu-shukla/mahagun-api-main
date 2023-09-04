import express, { json } from "express";
import expressWs from "express-ws";
import { connectDB } from "./config/db.js";
import cors from "cors";
import helmet from "helmet";
import customerRouter from "./routes/customer.js";
import dataRouter from "./routes/data.js";
import profileRouter from "./routes/profile.js";
import ticketsRouter from "./routes/tickets.js";
import bodyParser from "body-parser";
import winston from "winston";
import expressWinston from "express-winston";
import adminRouter from "./routes/admin.js";
import dashboardRouter from "./routes/dashboard.js";
import notificationsRouter from "./routes/notifications.js";
import wsRouter from "./routes/websocket.js";
import approvalsRouter from "./routes/approvals.js";
import inquiryRouter from "./routes/inquiry.js";
import customizationsRouter from "./routes/customizations.js";
import marketingRouter from "./routes/marketing.js";

const app = express();

app.use(cors());

expressWs(app);

// Connect Database
connectDB();

app.use(helmet());

// Init Middleware
app.use(json({ extended: true }));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: false,
    colorize: true,
  })
);

app.get("/", (req, res) => res.send("API Running"));

// Define Routes
app.use("/customer", customerRouter);

app.use("/data", dataRouter);

app.use("/profile", profileRouter);

app.use("/tickets", ticketsRouter);

app.use("/admin", adminRouter);

app.use("/dashboard", dashboardRouter);

app.use("/notifications", notificationsRouter);

app.use("/approvals", approvalsRouter);

app.use("/customizations", customizationsRouter);

app.use("/marketing", marketingRouter);

app.use("/inquiry", inquiryRouter);

app.use("/ws", wsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

//pm2 graceful shutdown
const processExitHandler = async (error) => {
  if (error) console.log(" ~ ~ processExitHandler ~ error", error);
  process.exit(error ? 1 : 0);
};

process.on("exit", processExitHandler);
process.on("SIGINT", processExitHandler);
process.on("SIGUSR1", processExitHandler);
process.on("SIGUSR2", processExitHandler);
process.on("uncaughtException", processExitHandler);
