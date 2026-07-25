export interface supplier_type {
    id: number;
    name: string;
    date_created: Date;
}

export interface suppliers_type {
    suppliers: supplier_type[];
    total: number;
    current_page: number;
    pages: number
}