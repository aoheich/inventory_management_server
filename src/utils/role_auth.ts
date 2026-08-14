import type { NextFunction, Request, Response } from "express";
import AppError from "../app_error.js";

export const role_auth = (req:Request, res:Response, next:NextFunction) => {
    
    if(req.user!.role !== "ADMIN") {
        throw new AppError("Access Denied", 403)

    }

    next()
}