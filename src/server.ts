import express from "express";
import { RootRouter } from "./routers/RootRouter";

const port = process.env.PORT || 3000;

export default function serverStartup () {
const app = express();
app.use(RootRouter.router);
app.listen(port, () => {
        console.log("Server started on port 3000");
    });
};