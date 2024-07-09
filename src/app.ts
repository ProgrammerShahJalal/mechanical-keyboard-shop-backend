import cors from "cors";
import express, { Application, Request, Response } from "express";
import "dotenv/config";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";

const app: Application = express();
//parsers
app.use(express.json());
app.use(cors());

// application routes
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Mechanical Keyboard Shop API is Running 🚀");
});

//global error handler
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
