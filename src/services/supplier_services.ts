import prisma from "../prisma_init.js"
import AppError from "../app_error.js"

export const create_supplier = async (supplier_name: string) => {
    const suppplier_exists = await prisma.supplier.findUnique({
        where: {
            name: supplier_name
        }
    })

    if (suppplier_exists) {
        throw new AppError("Supplier Already Exists",409)
    }

    const new_supplier = await prisma.supplier.create({
        data: {
            name: supplier_name
        }
    })

    return new_supplier
}

export const get_supplier = async (supplier_id: number) => {

    const supplier = await prisma.supplier.findUnique({
        where: {
            id: supplier_id
        }, select: {
            id: true,
            name: true,
            date_created: true, 
        }
    })

    if(!supplier) {
        throw new AppError("Supplier Does Not Exist", 404)
    }

    return supplier

}

export const get_suppliers = async (page: number) => {
    const suppliers = await prisma.supplier.findMany({
        take: 10,
        skip: (page - 1) * 10,
        orderBy: {
            "id": "asc"
        },
        select: {
            id: true,
            name: true,
            date_created: true,
        }

    })

    const count = await prisma.supplier.count()

    return {
        suppliers: suppliers,
        total: count,
        current_page: page,
        pages: Math.ceil(count/10)

    }
}

export const update_supplier = async (supplier_name: string, supplier_id: number) => {

    const supplier = await prisma.supplier.findUnique({
        where: {
            id: supplier_id
        }
    })

    if(!supplier) {
        throw new AppError("Supplier Does Not Exist", 404)
    }

    const supplier_with_name = await prisma.supplier.findUnique({
        where: {
            name: supplier_name
        }
    })

    if(supplier_with_name) {
        if(supplier_id != supplier_with_name.id) {
            throw new AppError("Wrong Request", 409)
        }
    }

    const updated_supplier = await prisma.supplier.update({
        data: {
            name: supplier_name
        }, where: {
            id: supplier_id
        }
    })

    return updated_supplier   

}

export const delete_supplier = async (supplier_id: number) => {

    const supplier = await prisma.supplier.findUnique({
        where: {
            id: supplier_id
        }
    })

    if(!supplier) {
        throw new AppError("Supplier Does Not Exist", 404)
    }

    const count = await prisma.product.count({
        where: {
            supplier_id:  supplier_id
        }
    })

    if (count > 0) {
        throw new AppError("Cannot Delete Supplier: Associated Products Present",409)
    }

    await prisma.supplier.delete({
        where: {
            id: supplier_id
        }
    })

    return {
        message: "Supplier Successfully Deleted"
    }

}