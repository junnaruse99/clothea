import cors from "cors";
import express from "express";
import { config } from "./config";
import { adminRouter, UPLOADS_DIR } from "./routes/admin";
import { catalogRouter } from "./routes/catalog";
import { deliveryRouter } from "./routes/delivery";
import { ordersRouter } from "./routes/orders";

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// Fotos de productos (en el repo por ahora; ver routes/admin.ts para S3)
app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "clothea-api" });
});

app.use("/api", catalogRouter);
app.use("/api/delivery", deliveryRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/admin", adminRouter);

app.use(
  (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
);

app.listen(config.port, () => {
  console.log(`Clothea API escuchando en http://localhost:${config.port}`);
});
