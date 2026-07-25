import { Type } from "@prisma/client";

export interface transaction_dto {
    product_id: number;
    quantity: number;
    type: Type;
    supplier_id?: number 
}      