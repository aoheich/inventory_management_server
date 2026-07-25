import {Router} from "express"
import { supplier_create, supplier_delete, supplier_get, supplier_update, suppliers_get } from "../controllers/supplier_controller.js"
import { async_handler } from "../utils/async_handler.js"

const supplier_router = Router()

supplier_router.post("/", async_handler(supplier_create))
supplier_router.get("/", async_handler(suppliers_get))
supplier_router.get("/:id", async_handler(supplier_get))
supplier_router.patch("/:id", async_handler(supplier_update))
supplier_router.delete("/:id", async_handler(supplier_delete))

export default supplier_router