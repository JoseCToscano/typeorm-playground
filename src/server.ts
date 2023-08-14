import express from "express";
import { RootRouter } from "./routers/RootRouter";

const app = express();

app.use(RootRouter.router);

export default app;