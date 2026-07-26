import type { Request, Response } from "express";
import type { product_dto } from "../types/product_dto.js";
import type { api_response } from "../types/response_type.js";
import { create_product, delete_product, get_product, get_products, update_product } from "../services/product_services.js";
import type { product_type, products_type } from "../types/product_type.js";


export const product_create = async (req: Request<{}, {}, product_dto>, res: Response<api_response<product_type>>) => {

    const data = req.body
    
    const new_product = await create_product(data)

    res.status(201).json({
        message: "Product Created Successfully",
        data: new_product
    })
} 

export const product_get = async (req: Request<{id: string}>, res: Response<api_response<product_type>>) => {

    const id = Number(req.params.id)

    const product = await get_product(id)

    res.status(200).json({
        message: "Product Details",
        data: product
    })
}

export const products_get = async (req: Request<{}, {}, {}, {page: string}>, res: Response<api_response<products_type>>) => {

    const page = Number(req.query.page)

    const products = await get_products(page)

    res.status(200).json({
        message: "All Product Details",
        data: products
    })

}

export const product_update = async (req: Request<{id: string}, {}, {name?: string, supplier_id?: string}>, res: Response<api_response<product_type>>) => {

    const product_id = Number(req.params.id)
    const supplier_id = req.body.supplier_id !== undefined ? Number(req.body.supplier_id) : undefined;

    const updated_product = await update_product(product_id, req.body.name, supplier_id)

    res.status(200).json({
        message: "Product Updated Successfully",
        data: updated_product
    })

}

export const product_delete = async (req: Request<{id: string}>, res: Response<{message: string}>) => {
   
    const product_id = Number(req.params.id)

    const result = await delete_product(product_id)

    res.status(200).json(result)

}   