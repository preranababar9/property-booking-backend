import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index"

const app = express();

app.use(cors());
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
  );
  app.use(express.json({ limit: "10mb" }));

// Health route
app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "ok", env: process.env.NODE_ENV || "development" });
});

  app.use('/api/v1', routes);


export default app;
