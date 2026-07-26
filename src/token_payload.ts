import {type JwtPayload } from "jsonwebtoken";

export interface token_payload extends JwtPayload {
    token_version: number;
    role: string;
    user_id: number;
}