import { type Request, type Response } from "express";
import type { user_dto } from "../types/user_dto.js";
import { register_user, login_user, get_current_user, get_all_users, delete_user } from "../services/user_services.js"
import { type api_response } from "../types/response_type.js";
import { type user_type } from "../types/user_type.js";

export const create_user =  async (req:Request<{}, {}, user_dto>, res:Response<api_response<user_type>>) => {
   
    const new_user = await register_user(req.body)

    res.status(201).json({message: "User Created Successfully", data: new_user})
}

export const user_login = async (req:Request<{}, {}, user_dto>, res:Response<api_response<user_type>>) => {
    
    const user = await login_user(req.body)

    res.status(200).json({message: "User Logged In Successfully", data: user})
}

export const current_user = async (req:Request, res:Response<api_response<user_type>>) => {

    const current_user = await get_current_user(req.user!.id) // added a declaration this will be from auth later

    res.status(200).json({message: "User Details Available", data: current_user})

}

export const get_users = async (req: Request<{},{}, {}, {page: string}>, res:Response<api_response<user_type[]>>) => {
    
    const page = Number(req.query.page) || 1

    const users = await get_all_users(page) 

    res.status(200).json({message: "All users", data: users})
}

export const user_delete = async (req: Request<{id: string}>, res:Response<{message: string}>) => {

    const id = Number(req.params.id)
    
    const result = await delete_user(id)

    res.status(200).json(result)
}