import { Router, type IRouter } from "express";
import { newsItems } from "./mockData.js";
import {
  GetNewsQueryParams,
  GetNewsResponse,
  GetNewsItemParams,
  GetNewsItemResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/news", async (req, res): Promise<void> => {
  const params = GetNewsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  let filtered = [...newsItems];
  if (params.data.country && params.data.country !== "All") {
    filtered = filtered.filter((n) => n.countryCode === params.data.country);
  }
  if (params.data.severity) {
    filtered = filtered.filter((n) => n.severity === params.data.severity);
  }
  if (params.data.sector && params.data.sector !== "All") {
    filtered = filtered.filter((n) => n.sector === params.data.sector);
  }

  res.json(GetNewsResponse.parse(filtered));
});

router.get("/news/:id", async (req, res): Promise<void> => {
  const params = GetNewsItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const item = newsItems.find((n) => n.id === params.data.id);
  if (!item) {
    res.status(404).json({ error: "News item not found" });
    return;
  }

  res.json(GetNewsItemResponse.parse(item));
});

export default router;
