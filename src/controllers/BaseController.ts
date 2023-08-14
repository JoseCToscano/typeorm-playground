import { Response } from 'express';

export abstract class BaseController {
    public static jsonResponse(res: Response, code: number, message: string) {
        return res.status(code).json({ message });
    }

    public ok<T>(res: Response, dto?: T) {
        if (dto) {
            res.type('application/json');
            return res.status(200).json(dto);
        }
        return res.sendStatus(200);
    }


    public badRequest(res: Response, message?: string) {
        return BaseController.jsonResponse(
            res,
            400,
            message || 'BAD REQUEST'
        );
    }



    public unauthorized(res: Response, message?: string) {
        return BaseController.jsonResponse(
            res,
            401,
            message || 'UNAUTHORIZED'
        );
    }



    public forbidden(res: Response, message?: string) {
        return BaseController.jsonResponse(
            res,
            403,
            message || 'FORBIDDEN'
        );
    }

    public notFound(res: Response, message?: string) {
        return BaseController.jsonResponse(
            res,
            404,
            message || 'NOT FOUND'
        );
    }



}
