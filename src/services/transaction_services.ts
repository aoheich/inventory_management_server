import prisma from "../prisma_init.js";
import AppError from "../app_error.js";
import type { transaction_dto } from "../types/transaction_dto.js";

export const create_transaction = async (data: transaction_dto, user_id: number) => {

    if (data.type === "OUT" && data.supplier_id !== undefined) {
        throw new AppError("Supplier_id cannot be provided for OUT transactions", 400);
    }

    const product = await prisma.product.findUnique({
        where: {
            id: data.product_id
        }
    })

    if (!product) {
        throw new AppError("Product Not Found", 404)
    }


    if (data.supplier_id) {
        const supplier = await prisma.supplier.findUnique({
            where: {
                id: data.supplier_id
            }
        })
        if (!supplier) {
            throw new AppError("Supplier Not Found", 404)
        }
    }

    const transaction = await prisma.$transaction(async (tn) => {

        if (data.type === "OUT") {

            const result = await tn.product.updateMany({
                where: {
                    id: data.product_id,
                    quantity: {
                        gte: data.quantity
                    }
                }, data: {
                    quantity: {
                        decrement: data.quantity
                    }
                }
            })

            if (result.count === 0) {
                throw new AppError("Requested Product Quantity Is Higher Than Available Stock", 400)
            }

        } else {
            await tn.product.update({
                where: {
                    id: data.product_id
                }, data: {
                    quantity: {
                        increment: data.quantity
                    }
                }
            })
        }


        const new_transaction = await tn.transaction.create({
            data: {
                product_id: data.product_id,
                quantity: data.quantity,
                type: data.type,
                user_id: user_id,
                supplier_id: data.supplier_id || null
            }
        })

        return new_transaction
    })

    return transaction
}

export const get_transaction = async (transaction_id: string) => {

    const transaction = await prisma.transaction.findUnique({
        where: {
            id: transaction_id
        }, select: {
            id: true,
            date_created: true,
            type: true,
            quantity: true,
            product_id: true,
            user_id: true,
            product: {
                select: {
                    id: true,
                    name: true
                }
            },
        }
    })

    if (!transaction) {
        throw new AppError("Transaction Does Not Exist", 404)
    }

    return transaction
}

export const get_transactions = async (page: number) => {

    const transactions = await prisma.transaction.findMany({
        take: 10,
        skip: (page - 1) * 10,
        orderBy: {
            date_created: "desc"
        },
        select: {
            id: true,
            date_created: true,
            type: true,
            quantity: true,
            product_id: true,
            user_id: true,
            product: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    const count = await prisma.transaction.count()

    return {
        transactions: transactions,
        total: count,
        current_page: page,
        pages: Math.ceil(count / 10)
    }

}

