import type { Request, Response } from "express";
import type { api_response } from "../types/response_type.js";
import type { transaction_type, transactions_type } from "../types/transaction_type.js";
import type { transaction_dto } from "../types/transaction_dto.js";
import { create_transaction, get_transaction, get_transactions } from "../services/transaction_services.js";


export const transaction_create = async (req:Request<{},{},transaction_dto>, res:Response<api_response<transaction_type>>) => {

    const data = req.body

    const new_transaction = await create_transaction(data, req.user!.id)

    res.status(201).json({
        message: "Transaction Created Successfully",
        data: new_transaction
    })
}

export const transaction_get = async (req:Request<{transaction_id: string}>, res:Response<api_response<transaction_type>>) => {
    
    const transaction = await get_transaction(req.body.transaction_id)

    res.status(200).json({
        message: "Transaction Found",
        data: transaction
    })
}

export const transactions_get = async (req:Request<{},{},{},{page: string}>, res:Response<api_response<transactions_type>>) => {

    const page = Number(req.query.page)

    const transactions = await get_transactions(page)

    res.status(200).json({
        message: "All Transactions",
        data: transactions
    })

}