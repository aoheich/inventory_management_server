import type { Request, Response } from "express";
import { create_supplier, delete_supplier, get_supplier, get_suppliers, update_supplier } from "../services/supplier_services.js";
import type { api_response } from "../types/response_type.js";
import type { supplier_type,suppliers_type } from "../types/supplier_type.js";

export const supplier_create = async (req: Request<{}, {}, {name: string}>,  res: Response<api_response<supplier_type>>) =>  {
    
    const new_supplier = await create_supplier(req.body.name)

    res.status(201).json({message: "Supplier Created Successfully", data: new_supplier})
}

export const supplier_get = async (req: Request<{id: string}>,  res: Response<api_response<supplier_type>>) => {
    
    const id = Number(req.params.id)
   
    const supplier = await get_supplier(id)

    res.status(200).json({message: "Supplier Details:", data: supplier})

} 

export const suppliers_get = async (req: Request<{}, {}, {}, {page: string}>,  res: Response<api_response<suppliers_type>>) => {

    const page = Number(req.query.page)
  
    const suppliers = await get_suppliers(page) // validator implmeneted later will already change it to number

    res.status(200).json({message: "All Supplier Details:", data: suppliers})

}

export const supplier_update = async (req: Request<{ id: string}, {}, {name: string}>,  res: Response<api_response<supplier_type>>) => {

    const id =  Number(req.params.id)
    
    const updated_supplier = await update_supplier(req.body.name, id)

    res.status(200).json({message: "Supplier Updated Successfully", data: updated_supplier})
}

export const supplier_delete = async (req: Request<{id: string}>,  res: Response<{message: string}>) => {

    const id =  Number(req.params.id)
    
    const result = await delete_supplier(id)

    res.status(200).json(result)
}