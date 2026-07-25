import { Router } from "express";
import { async_handler } from "../utils/async_handler.js";
import { product_create, product_delete, product_get, product_update, products_get } from "../controllers/product_controller.js";

const product_router = Router()

product_router.post("/", async_handler(product_create))
product_router.get("/", async_handler(products_get))
product_router.get("/:id", async_handler(product_get))
product_router.patch("/:id", async_handler(product_update))
product_router.delete("/:id", async_handler(product_delete))

export default product_router

