import AppError from "../app_error.js";
import { sign_access_token, verify_refresh_token } from "../utils/jwt.js";
import prisma from "../prisma_init.js";

export const refresh_access_token = async (token: string) => {

    const payload = verify_refresh_token(token);

    const user = await prisma.user.findUnique({
        where: {
            id: payload.user_id
        }, select: {
            token_version: true,
            email: true,
            role: true,
            id: true
        }
    })

    if (!user) {
        throw new AppError("Unauthorized", 401)
    }


    if (payload.token_version !== user.token_version) {
        throw new AppError("Token Invalid", 401)
    }

    const data = {
        user_id: user.id,
        role: user.role,
        token_version: user.token_version
    }

    const access_token = sign_access_token(data)

    return access_token

}

export const clear_refresh_token = async (token: string) => {

    const payload = verify_refresh_token(token)

    const user = await prisma.user.findUnique({
        where: {
            id: payload.user_id
        }
    })

    if (!user) {
        throw new AppError("Unauthorized", 401)
    }

    if (payload.token_version !== user.token_version) {
        throw new AppError("Invalid Token", 401);
    }

    await prisma.user.update({
        data: {
            token_version: {
                increment: 1
            }
        }, where: {
            id: user.id
        }
    })


}