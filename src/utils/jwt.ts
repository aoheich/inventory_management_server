import jwt from "jsonwebtoken"
import {type user_type } from "../types/user_type.js"
import AppError from "../app_error.js"
import type { token_payload } from "../token_payload.js"

const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY!
const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY!


export const sign_token = (data: user_type) => {

    const payload = {
        token_version: data.token_version,
        role: data.role,
        user_id: data.id
    }
    
    const access_token = jwt.sign(payload,ACCESS_TOKEN_KEY, {expiresIn: "15m"})
    const refresh_token = jwt.sign(payload,REFRESH_TOKEN_KEY, {expiresIn: "1d"})
    
    return {
        access_token,
        refresh_token
    }
}

export const sign_access_token = (data: token_payload) => {

    const payload = {
        token_version: data.token_version,
        role: data.role,
        user_id: data.id
    }

    const access_token = jwt.sign(payload,ACCESS_TOKEN_KEY, {expiresIn: "15m"})

    return access_token
}

export const verify_refresh_token = (token: string) => {

    const payload = jwt.verify(token, REFRESH_TOKEN_KEY)

    if(!payload) {
        throw new AppError("Invalid Token",401)
    }

    return payload as token_payload

}

export const verify_access_token = (token: string) => {

    const payload = jwt.verify(token, ACCESS_TOKEN_KEY)

    if(!payload) {
        throw new AppError("Invalid Token",401)
    }
     
    return payload as token_payload
}