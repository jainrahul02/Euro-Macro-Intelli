import { Router, type IRouter } from "express";
import { dashboardSummary, dashboardAlerts, heatmapCountries } from "./mockData.js";
import {
  GetDashboardSummaryResponse,
  GetDashboardAlertsResponse,
  GetDashboardHeatmapResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  res.json(GetDashboardSummaryResponse.parse(dashboardSummary));
});

router.get("/dashboard/alerts", async (_req, res): Promise<void> => {
  res.json(GetDashboardAlertsResponse.parse(dashboardAlerts));
});

router.get("/dashboard/heatmap", async (_req, res): Promise<void> => {
  res.json(GetDashboardHeatmapResponse.parse(heatmapCountries));
});

export default router;
