import prisma from "../prisma_init.js";
import AppError from "../app_error.js";
import { type product_dto } from "../types/product_dto.js";
import { totalmem } from "node:os";
import { afterEach } from "node:test";

export const create_product = async (data: product_dto) => {

    const product_exists = await prisma.product.findUnique({
        where: {
            name: data.name
        }
    })

    if (product_exists) {
        throw new AppError("Product Already Exists", 409)
    }

    const supplier_exists = await prisma.supplier.findUnique({
        where: {
            id: data.supplier_id
        }
    })

    if (!supplier_exists) {
        throw new AppError("Supplier Does Not Exist", 404)
    }

    const new_product = await prisma.product.create({
        data: {
            name: data.name,
            supplier_id: data.supplier_id,
            quantity: data.quantity
        }, select: {
            name: true,
            supplier_id: true,
            quantity: true,
            id: true,
            date_created: true,
        }
    })

    return new_product
}

export const get_product = async (product_id: number) => {

    const product = await prisma.product.findUnique({
        where: {
            id: product_id
        }, select: {
            name: true,
            quantity: true,
            supplier_id: true,
            id: true,
            date_created: true,
            supplier: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    if (!product) {
        throw new AppError("Product Not Found", 404)
    }


    return product
}

export const get_products = async (page: number) => {

    const products = await prisma.product.findMany({
        take: 10,
        skip: (page - 1) * 10,
        select: {
            name: true,
            quantity: true,
            id: true,
            supplier_id: true,
            date_created: true,
            supplier: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
        orderBy: {
            id: "asc"
        }
    })

    const count = await prisma.product.count()


    return {
        products: products,
        total: count,
        current_page: page,
        pages: Math.ceil(count / 10)
    }

}

export const update_product = async (product_id: number, product_name?: string, supplier_id?: number) => {

    const product = await prisma.product.findUnique({
        where: {
            id: product_id
        }
    })

    if (!product) {
        throw new AppError("Product Not Found", 404)
    }

    if (supplier_id) {
        const supplier = await prisma.supplier.findUnique({
            where: {
                id: supplier_id
            }
        })

        if (!supplier) {
            throw new AppError("Supplier Not Found", 404)
        }
    }

    if (product_name) {
        const name_exists = await prisma.product.findUnique({
            where: {
                name: product_name
            }
        })

        if (name_exists && product_id != name_exists.id) {
            throw new AppError("Name Already Exists", 409)
        }
    }

    const data: Partial<product_dto> = {};

    if (product_name !== undefined) { // To prevent skipping valid values like 0 not needed here just a reminder
        data.name = product_name;
    }

    if (supplier_id !== undefined) {  // To prevent skipping valid values like 0 not needed here just a reminder
        data.supplier_id = supplier_id;
    }

    const new_product = await prisma.product.update({
        data: data,
        where: {
            id: product_id
        }, select: {
            name: true,
            quantity: true,
            id: true,
            supplier_id: true,
            date_created: true,
            supplier: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })


    return new_product
}

export const delete_product = async (product_id: number) => {

    const product_exists = await prisma.product.findUnique({
        where: {
            id: product_id
        }
    })

    if(!product_exists) {
        throw new AppError("Product Not Found", 404)
    }

    const product_transactions_count = await prisma.transaction.count({
        where: {
            product_id: product_id
        }
    })

    if(product_transactions_count > 0) {
        throw new AppError("Cannot Delete Products: Associated Transactions Present", 409)
    }

    await prisma.product.delete({
        where: {
            id: product_id
        }
    })

    return {
        message: "Product Successfully Deleted"
    }
}