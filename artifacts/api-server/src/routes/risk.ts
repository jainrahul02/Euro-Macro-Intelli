import { Router, type IRouter } from "express";
import { countryRiskRankings, heatmapCountries } from "./mockData.js";
import {
  GetRiskCountriesQueryParams,
  GetRiskCountriesResponse,
  GetRiskHeatmapQueryParams,
  GetRiskHeatmapResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/risk/countries", async (req, res): Promise<void> => {
  const params = GetRiskCountriesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const riskType = params.data.riskType;
  let sorted = [...countryRiskRankings];

  if (riskType && riskType !== "overall") {
    const keyMap: Record<string, keyof typeof countryRiskRankings[0]> = {
      inflation: "inflationRisk",
      fx: "fxStress",
      energy: "energyRisk",
      housing: "housingRisk",
      geopolitical: "geopoliticalRisk",
    };
    const key = keyMap[riskType];
    if (key) {
      sorted = sorted.sort((a, b) => (b[key] as number) - (a[key] as number))
        .map((c, i) => ({ ...c, rank: i + 1 }));
    }
  }

  res.json(GetRiskCountriesResponse.parse(sorted));
});

router.get("/risk/heatmap", async (req, res): Promise<void> => {
  const params = GetRiskHeatmapQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  res.json(GetRiskHeatmapResponse.parse(heatmapCountries));
});

export default router;
