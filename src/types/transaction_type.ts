import { Type } from "@prisma/client";

export interface transaction_type {
    id: string;
    date_created: Date;
    type: Type;
    quantity: number;
    product_id: number;
    user_id: number;
    product?: {
        id: number;
        name: string;
    }
}

export interface transactions_type {
    transactions: transaction_type[];
    total: number;
    current_page: number;
    pages: number;
}