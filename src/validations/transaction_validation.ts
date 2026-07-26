import { query, body, param } from "express-validator";


export const create_transaction_validation = [
    body("product_id")
    .notEmpty().withMessage("product_id field required")
    .isInt({min: 1}).withMessage("Product_id Must Be A Positive Integer"),
    body("quantity")
    .notEmpty().withMessage("quantity field required")
    .isInt({min: 1}).withMessage("Quantity Must Be A Positive Integer"),
    body("type")
    .trim()
    .notEmpty().withMessage("type field required")
    .isIn(["OUT","IN"]).withMessage("Type Must Be Either IN or OUT"),
    body("supplier_id")
    .optional()
    .notEmpty().withMessage("supplier_id field must not be empty")
    .isInt({min: 1}).withMessage("Supplier_id Must Be A Positive Integer")
]

export const get_transaction_validation = [
    param("id")
    .trim()
    .notEmpty().withMessage("id field required")
]

export const get_transactions_validation = [
    query("page")
    .notEmpty().withMessage("page field required")
    .isInt({min: 1}).withMessage("Page Must Be A Positive Integer")
]