import { Router, type IRouter } from "express";
import { scenarios, simulationResults } from "./mockData.js";
import {
  GetScenariosResponse,
  RunSimulationBody,
  RunSimulationResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/simulator/scenarios", async (_req, res): Promise<void> => {
  res.json(GetScenariosResponse.parse(scenarios));
});

router.post("/simulator/run", async (req, res): Promise<void> => {
  const parsed = RunSimulationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { scenarioId, intensity } = parsed.data;
  const generator = simulationResults[scenarioId];

  if (!generator) {
    // Default fallback for unknown scenarios
    const fallback = simulationResults["oil-spike"];
    res.json(RunSimulationResponse.parse(fallback(intensity)));
    return;
  }

  res.json(RunSimulationResponse.parse(generator(intensity)));
});

export default router;
