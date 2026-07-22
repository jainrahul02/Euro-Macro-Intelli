import { Router, type IRouter } from "express";
import { sidebarInsights } from "./mockData.js";
import {
  GetSidebarInsightQueryParams,
  GetSidebarInsightResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/sidebar/insight", async (req, res): Promise<void> => {
  const params = GetSidebarInsightQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const page = params.data.page ?? "dashboard";
  const insight = sidebarInsights[page] ?? sidebarInsights["dashboard"];

  res.json(GetSidebarInsightResponse.parse(insight));
});

export default router;
