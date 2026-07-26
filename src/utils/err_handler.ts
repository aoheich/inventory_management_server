import type { NextFunction, Request, Response } from "express";
import AppError from "../app_error.js";
import { Prisma } from "@prisma/client";

export const err_handler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    
    if (err instanceof AppError) {
        return res.status(err.status).json({
            message: err.message
        })
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {

        switch (err.code) {

            case "P2002":
                return res.status(409).json({
                    message: "Resource Already Exists"
                });

            case "P2025":
                return res.status(404).json({
                    message: "Resource Not Found"
                });

            default:
                return res.status(500).json({
                    message: "Database Error"
                });
        }
    }

    console.error(err);

    return res.status(500).json({
        message: "Internal Server Error"
    });

}