export interface product_type {
    name: string,
    supplier_id: number,
    quantity: number,
    id: number,
    date_created: Date
    supplier?: {
        name: string;
        id: number;
    };
} 

export interface products_type {
    products: product_type[];
    total: number;
    current_page: number;
    pages: number
}