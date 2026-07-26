import type { NextFunction, Request, Response } from "express"
import prisma from "../prisma_init.js"
import { verify_access_token } from "./jwt.js"
import AppError from "../app_error.js"

export const token_auth = async (req: Request<{}>, res: Response<{}>, next: NextFunction) => {

    const auth_header = req.headers["authorization"]
    if (!auth_header) {
        throw new AppError("Authorization Required", 401)
    }

    const parts = auth_header.split(" ")

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        throw new AppError("Invalid Authorization Format", 401)
    }

    const token = parts[1]
    const payload = verify_access_token(token!)

    const db_user = await prisma.user.findUnique({
        where: {
            id: payload.user_id
        }, select: {
            token_version: true,
            email: true,
            role: true,
            id: true
        }
    })

    if (!db_user) {
        throw new AppError("Unauthorized", 401)
    }


    if (payload.token_version !== db_user.token_version) {
        throw new AppError("Token Invalid", 401)
    }

    req.user = { id: db_user.id, role: db_user.role, token_version: db_user.token_version }

    next()
} 