import {Request, Response, Router as ExpressRouter } from "express";
import { UserRouter } from "./UserRouter";

class Router {

    private readonly __router: ExpressRouter;

    get router(): ExpressRouter {
        return this.__router;
    }

    constructor() {
        this.__router = ExpressRouter();
        this.router.get('/', this.root);
        this.router.use('/users', UserRouter.router);
    }

    root(req: Request, res: Response) {
        res.send('Hello from root!');
    }

}

export const RootRouter = new Router();