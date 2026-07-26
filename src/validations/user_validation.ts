import { body, query, param } from "express-validator";

export const user_validation = [
    body("email")
    .notEmpty().withMessage("email Field Required")
    .isEmail().withMessage("Enter A Valid Email"),
    body("password")
    .trim()
    .notEmpty().withMessage("password Field Required")
    .isLength({max: 10, min: 5}).withMessage("Password Must Be Between 5 & 10 Characters")
]

export const get_users_validation = [
    query("page")
    .notEmpty().withMessage("page Field Required")
    .isInt({min: 1}).withMessage("Page Must Be a Postive Integer")
]

export const delete_user_validation = [
    param("id")
    .exists().withMessage("id Must Be Present")
    .isInt({min: 1}).withMessage("Id Must Be A Postive Integer")
]