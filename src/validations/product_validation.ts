import { query, body, param } from "express-validator";


export const create_product_validation = [
    body("name")
    .trim()
    .notEmpty().withMessage("name field required"),
    body("quantity")
    .notEmpty().withMessage("quantity field required")
    .isInt({min: 1}).withMessage("Quantity Must Be A Positive Integer"),
    body("supplier_id")
    .notEmpty().withMessage("supplier_id field required")
    .isInt({min: 1}).withMessage("Supplier_id Must Be A Positive Integer")
] 

export const get_product_validation = [
    param("id")
    .notEmpty().withMessage("id field required")
    .isInt({min: 1}).withMessage("Id Must Be A Positive Integer")
]

export const get_products_validation = [
    query("page")
    .notEmpty().withMessage("page field required")
    .isInt({min: 1}).withMessage("Page Must Be A Postive Integer")
]

export const update_product_validation = [
    param("id")
    .notEmpty().withMessage("id field required")
    .isInt({min: 1}).withMessage("Id Must Be A Postive Integer"),
    body("name")
    .optional()
    .trim()
    .notEmpty().withMessage("name field must not be empty"),
    body("supplier_id")
    .optional()
    .notEmpty().withMessage("supplier_id must not be empty")
    .isInt({min: 1}).withMessage("Supplier_id Must Be A Positive Integer")
]

export const delete_product_validation = [
    param("id")
    .notEmpty().withMessage("if field required")
    .isInt({min: 1}).withMessage("Id Must Be A Postive Integer"),
]