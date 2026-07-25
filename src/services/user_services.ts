import prisma from "../prisma_init.js"
import AppError from "../app_error.js"
import bcrypt from "bcrypt"
import type { user_dto } from "../types/user_dto.js"

const PEPPER = process.env.PEPPER
const SALT = Number(process.env.SALT) || 20

export const register_user = async (data: user_dto) => {

    const user_exists = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })

    if (user_exists) {
        throw new AppError("User Already Exists", 409)
    }

    const hashedpassword = await bcrypt.hash(data.password + PEPPER, SALT)

    const user = await prisma.user.create({
        data: {
            email: data.email,
            password: hashedpassword
        }
    })

    const new_user = {
        id: user.id,
        role: user.role,
        token_version: user.token_version
    }
    return new_user
} 

export const login_user = async (data: user_dto) => {
    const user_exists = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })

    if (!user_exists) {
        throw new AppError("Invalid Credentials", 401)
    }

    const result = await bcrypt.compare(data.password + PEPPER, user_exists.password)

    if (!result) {
        throw new AppError("Invalid Credentials", 401)
    }

    const user = {
        id: user_exists.id,
        role: user_exists.role,
        token_version: user_exists.token_version
    }

    return user
}

export const get_current_user = async (user_id: number) => {

    const user_exists = await prisma.user.findUnique({
        where: {
            id: user_id
        }, select: {
            id: true,
            role: true,
            email: true,
            token_version: true
        }
    })

    if (!user_exists) {
        throw new AppError("User Not Found", 404)
    }

    return user_exists

}

export const get_all_users = async (page: number) => {

    const users = await prisma.user.findMany({
        take: 10,
        skip: (page - 1) * 10, 
        select: {
            id: true,
            role: true,
            email: true,
            token_version: true
        },
        orderBy: {
            id: "asc"
        }
    })

    return users
}

export const delete_user = async (user_id: number) => {
    const user_exists = await prisma.user.findUnique({
        where: {
            id: user_id
        }
    })

    if(!user_exists) {
        throw new AppError("User Not Found",404)
    }

    await prisma.user.delete({
        where: {
            id: user_id
        }
    }) 

    return {
        message: "User Successfully Deleted"
    }
}