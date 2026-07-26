import { type user_type } from "./user_type.js";

export interface auth_user_type extends user_type {
    access_token: string;
}