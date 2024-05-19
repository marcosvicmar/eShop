import { ProductItem } from "@/components";
import { Products } from "@/models";
import { useCartProvider, withCartProvider } from "@/providers";

import { Flex } from "@chakra-ui/react";
import { useCallback } from "react";

interface ProductList {
    products: Products[];
}

const ProductListRaw: React.FC<ProductList> = ({ products }) => {   
    const { addToCart, buyNowProduct } = useCartProvider();
     
    const repetableItems = useCallback(() => {
        const result = []

        for (let i = 0; i < products?.length; i += 4) {
            const row = [];
            for (let j = 0; j < 4; j++) {
                if (i + j >= products?.length) break;
                
                row.push(
                    <ProductItem 
                        key={i + j} 
                        productObj={products[i + j]} 
                        showButtons={true} 
                        scale={0.75} 

                        onAddToCart={(product) => addToCart({
                            productId: product.id,
                            count: 1,
                        })}

                        onBuyNow={(product) => buyNowProduct({
                            productId: product.id,
                            count: 1,
                        })}
                    />
                );
            }

            result.push(
                <Flex direction='row' justifyContent='center' alignItems='center' gap={2}>
                    {row}
                </Flex>
            );
        }

        return result;
    }, [products]);

    return (
        <Flex direction='column' justifyContent='center' alignItems='center' gap={2}>
            {repetableItems()}
        </Flex>
    );
}

export const ProductList = withCartProvider(ProductListRaw);