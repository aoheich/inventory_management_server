import { Router } from "express";
import { async_handler } from "../utils/async_handler.js";
import { transaction_create, transaction_get, transactions_get } from "../controllers/transaction_controller.js";
import { token_auth } from "../utils/authentication.js";
import { create_transaction_validation, get_transaction_validation, get_transactions_validation } from "../validations/transaction_validation.js";
import { validation_result } from "../utils/validation_result.js";

const transaction_router = Router()

transaction_router.post("/", token_auth, create_transaction_validation, validation_result, async_handler(transaction_create))
transaction_router.get("/", token_auth, get_transactions_validation, validation_result, async_handler(transactions_get))
transaction_router.get("/:id", token_auth, get_transaction_validation, validation_result, async_handler(transaction_get))



export default transaction_router