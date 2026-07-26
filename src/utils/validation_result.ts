import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import AppError from "../app_error.js";

export const validation_result = (req:Request, res:Response, next:NextFunction) => {
    const result = validationResult(req)

    if(!result.isEmpty()) {
        throw new AppError(JSON.stringify(result.array()),400)
    }

    next()
}