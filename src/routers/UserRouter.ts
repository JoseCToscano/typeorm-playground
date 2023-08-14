import {Request, Response, Router as ExpressRouter } from "express";

class Router {

    private readonly __router: ExpressRouter;

    get router(): ExpressRouter {
        return this.__router;
    }

    constructor() {
        this.__router = ExpressRouter();
        this.router.get('/', this.getUsers);
    }

    getUsers(req: Request, res: Response) {
        res.send('Hello from GET/ users!');
    }

}

export const UserRouter = new Router();