import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import dashboardRouter from "./dashboard.js";
import newsRouter from "./news.js";
import riskRouter from "./risk.js";
import forecastRouter from "./forecast.js";
import simulatorRouter from "./simulator.js";
import sidebarRouter from "./sidebar.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(newsRouter);
router.use(riskRouter);
router.use(forecastRouter);
router.use(simulatorRouter);
router.use(sidebarRouter);

export default router;
