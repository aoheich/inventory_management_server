import express, { type Request, type Response } from "express"
import "dotenv/config"
import user_router from "./src/routes/user_routes.js";
import supplier_router from "./src/routes/supplier_routes.js";
import product_router from "./src/routes/product_routes.js";
import transaction_router from "./src/routes/transaction_routes.js";


const PORT = process.env.PORT || 9000; 
const app = express();
app.use(express.json());

app.use("/api/user", user_router)
app.use("/api/supplier", supplier_router)
app.use("/api/product", product_router)
app.use("/api/transaction", transaction_router)


app.listen(PORT, () => {
    console.log("Listening on PORT:" + PORT)
})