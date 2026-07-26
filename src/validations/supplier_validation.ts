import { query, body, param } from "express-validator";

export const create_supplier_validation = [
    body("name")
    .trim()
    .notEmpty().withMessage("name field required")
]

export const get_supplier_validation = [
    param("id")
    .notEmpty().withMessage("id field required")
    .isInt({min: 1}).withMessage("Id Must Be A Positive Integer")
]

export const get_suppliers_validation = [
    query("page")
    .notEmpty().withMessage("page field required")
    .isInt({min: 1}).withMessage("Page Must Be A Postive Integer")
]

export const update_supplier_validation  = [
    param("id")
    .notEmpty().withMessage("id field required")
    .isInt({min: 1}).withMessage("Id Must Be A Postive Integer"),
    body("name")
    .trim()
    .notEmpty().withMessage("name field required")
]

export const delete_supplier_validation = [
    param("id")
    .notEmpty().withMessage("id field required")
    .isInt().withMessage("Id Must Be A Postive Integer")
]