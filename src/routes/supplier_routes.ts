import {Router} from "express"
import { supplier_create, supplier_delete, supplier_get, supplier_update, suppliers_get } from "../controllers/supplier_controller.js"
import { async_handler } from "../utils/async_handler.js"
import { token_auth } from "../utils/authentication.js"
import { role_auth } from "../utils/role_auth.js"
import { create_supplier_validation, get_supplier_validation, get_suppliers_validation, delete_supplier_validation, update_supplier_validation } from "../validations/supplier_validation.js"
import { validation_result } from "../utils/validation_result.js"

const supplier_router = Router()

supplier_router.post("/", token_auth, role_auth, create_supplier_validation, validation_result, async_handler(supplier_create))
supplier_router.get("/", token_auth, get_suppliers_validation, validation_result,  async_handler(suppliers_get))
supplier_router.get("/:id", token_auth, get_supplier_validation, validation_result, async_handler(supplier_get))
supplier_router.patch("/:id", token_auth, role_auth, update_supplier_validation, validation_result, async_handler(supplier_update))
supplier_router.delete("/:id", token_auth, role_auth, delete_supplier_validation, validation_result, async_handler(supplier_delete))

export default supplier_router