import {type user_type } from "../types/user_type.js"

declare global {
    namespace Express {
        interface Request {
            user?: user_type
        }
    }
}