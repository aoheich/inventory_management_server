import { Router } from "express";
import { async_handler } from "../utils/async_handler.js";
import { create_user, current_user, get_users, refresh, user_delete, user_login } from "../controllers/user_controller.js";
import { delete_user_validation, get_users_validation, user_validation } from "../validations/user_validation.js";
import { validation_result } from "../utils/validation_result.js";
import { token_auth } from "../utils/authentication.js";
import { role_auth } from "../utils/role_auth.js";


const user_router = Router()



user_router.post("/register", user_validation, validation_result, async_handler(create_user))

user_router.post("/login", user_validation, validation_result, async_handler(user_login))

user_router.post("/refresh", async_handler(refresh))

user_router.get("/me", token_auth, async_handler(current_user))

user_router.get("/", token_auth, role_auth, get_users_validation, validation_result, async_handler(get_users))

user_router.delete("/:id", token_auth, role_auth, delete_user_validation, validation_result, async_handler(user_delete))


export default user_router