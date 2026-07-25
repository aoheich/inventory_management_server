import { Router } from "express";
import { async_handler } from "../utils/async_handler.js";
import { create_user, current_user, get_users, user_delete, user_login } from "../controllers/user_controller.js";


const user_router = Router()

user_router.post("/register", async_handler(create_user))

user_router.post("/login", async_handler(user_login))

user_router.get("/me", async_handler(current_user))

user_router.get("/", async_handler(get_users))

user_router.delete("/:id", async_handler(user_delete))


export default user_router