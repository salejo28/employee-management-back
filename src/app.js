import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import limiter from "express-rate-limit";
import { employeeRoutes, requestRoutes } from "./api/index.js";
import cors from "cors";

export const App = (port) => {
  const app = express();

  // Setup
  app.set("port", port);
  app.use(
    morgan(process.env.NODE_ENV === "development" ? "dev" : "production")
  );
  app.use(cors());
  app.use(express.json({ limit: "2mb", type: () => true }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));
  app.use(helmet());
  app.use(hpp());
  app.use(
    limiter({
      limit: 100,
    })
  );

  // Routes
  app.use("/api/employee", employeeRoutes());
  app.use("/api/request", requestRoutes());

  const listen = async () => {
    await new Promise((resolve) => app.listen(app.get("port"), resolve));
    console.log(`🚀 Server ready at http://localhost:${app.get("port")}`);
  };

  return { listen };
};
