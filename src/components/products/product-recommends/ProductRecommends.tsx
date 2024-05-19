import { Flex } from "@chakra-ui/react";
import React, { use, useEffect } from "react";
import { Products } from "../../../models/products.model";
import { useSession } from "@/providers/session.provider";
import { useRouter } from "next/router";
import { ProductItem } from "../product-item/ProductItem";
import { isArray } from "util";

interface ProductRecommends {
}

export const ProductRecommends: React.FC<ProductRecommends> = () => {
  const [ products, setProducts ] = React.useState<Products[]>([]);
  const [ productElements, setProductElements ] = React.useState<JSX.Element[]>([]);

  const { token } = useSession();

  useEffect(() => {
    fetch(`/api/v1/recommends`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);
  
  useEffect(() => {
    if (isArray(products)) {
      const productElements = products.map((product) => (
        <ProductItem key={product.id} productObj={product} showButtons={false} />
      ));
  
      setProductElements(productElements);
    }
  }, [products]);

  return (
    <Flex direction={"row"} wrap="wrap" gap={2} padding={0}>
      {productElements}
    </Flex>
  );
};