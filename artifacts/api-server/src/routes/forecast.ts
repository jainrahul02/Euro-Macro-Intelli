import { Router, type IRouter } from "express";
import { forecastPredictions } from "./mockData.js";
import { GetForecastPredictionsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/forecast/predictions", async (_req, res): Promise<void> => {
  res.json(GetForecastPredictionsResponse.parse(forecastPredictions));
});

export default router;
