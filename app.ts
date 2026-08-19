import express from "express"
import "dotenv/config"
import user_router from "./src/routes/user_routes.js";
import supplier_router from "./src/routes/supplier_routes.js";
import product_router from "./src/routes/product_routes.js";
import transaction_router from "./src/routes/transaction_routes.js";
import { err_handler } from "./src/utils/err_handler.js";
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/user", user_router)
app.use("/api/supplier", supplier_router)
app.use("/api/product", product_router)
app.use("/api/transaction", transaction_router)

app.use(err_handler)

export default app