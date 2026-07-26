import { Router } from "express";
import { async_handler } from "../utils/async_handler.js";
import { product_create, product_delete, product_get, product_update, products_get } from "../controllers/product_controller.js";
import { create_product_validation, delete_product_validation, get_product_validation, get_products_validation, update_product_validation } from "../validations/product_validation.js";
import { validation_result } from "../utils/validation_result.js";
import { token_auth } from "../utils/authentication.js";
import { role_auth } from "../utils/role_auth.js";

const product_router = Router()

product_router.post("/", token_auth, role_auth, create_product_validation, validation_result, async_handler(product_create))
product_router.get("/", token_auth, get_products_validation, validation_result, async_handler(products_get))
product_router.get("/:id", token_auth, get_product_validation, validation_result, async_handler(product_get))
product_router.patch("/:id", token_auth, role_auth, update_product_validation, validation_result, async_handler(product_update))
product_router.delete("/:id", token_auth, role_auth, delete_product_validation, validation_result, async_handler(product_delete))

export default product_router

