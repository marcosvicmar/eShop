import { ProductList } from "@/components";
import { Products } from "@/models";

import { useSession } from "@/providers/session.provider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";



export function ProductGrid() {
    const [products, setProducts] = useState<Products[]>([]);
    const { token } = useSession();

    useEffect(() => {
        fetch(`/api/v1/products`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => setProducts(data || []));
    }, []);

    return <ProductList products={products} />;
}
