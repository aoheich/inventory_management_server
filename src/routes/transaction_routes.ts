import { Router } from "express";
import { async_handler } from "../utils/async_handler.js";
import { transaction_create, transaction_get, transactions_get } from "../controllers/transaction_controller.js";

const transaction_router = Router()

transaction_router.post("/", async_handler(transaction_create))
transaction_router.get("/", async_handler(transactions_get))
transaction_router.get("/:id", async_handler(transaction_get))



export default transaction_router