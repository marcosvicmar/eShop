import { ProductList } from "@/components";
import { Products } from "@/models";

import { useSession } from "@/providers/session.provider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface ProductCategoriesProps {
    categoryId: string;
}

export const ProductCategories: React.FC<ProductCategoriesProps> = ({ categoryId }) => {    
    const [products, setProducts] = useState<Products[]>([]);
    const { token } = useSession();

    useEffect(() => {
        fetch(`/api/v1/categories?id=${categoryId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setProducts(data.type === 'error' ? [] : data.Products)
            });
    }, []);

    if (products.length === 0) {
        return (
            <div>
                <h1>No products found</h1>
            </div>
        );
    }

    return <ProductList products={products} />;
}
