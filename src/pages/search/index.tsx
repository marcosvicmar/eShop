import { ShopSkeleton } from "@/components/layouts";
import { ProductGrid } from "@/components/shared";
import { useSession } from "@/providers/session.provider";

import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function SearchResult() {
    const { query } = useRouter();
    const { token } = useSession();

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`/api/products?name=${query.name}`, {
            method: 'GET',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Basic ${token}`
            }
        })
        .then(res => res.json())
        .then(data => setProducts(data));
    }, []);

    return (
        <ShopSkeleton>
            <Flex direction='column' justifyContent='center' alignItems='center'>
                <ProductGrid products={products} />
            </Flex>
        </ShopSkeleton>
    );
}