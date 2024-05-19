import { Flex, Box, Center, Heading, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Products } from "../../../models/products.model";
import { useSession } from "@/providers/session.provider";
import { useRouter } from "next/router";

interface SearchFormProps {
  productId: number,
  units: number,
}

export const SmallIndividualProduct: React.FC<SearchFormProps> = ({ productId, units = 1 }) => {
  const [product, setProduct] = React.useState<any | null>(null);
  const { token } = useSession();

  useEffect(() => {
    fetch(`/api/v1/products?id=${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, []);
 
  return (
    <Flex direction={"row"}>
      <Box padding={"1rem"}>
        <img
          width={100}
          height={100}
          style={{
            minWidth: "100px",
          }}
          src="http://placehold.it/100x100"
        />
      </Box>
      <Box padding={"1.5rem"}>
        <Center>
          <Flex direction={"column"}>
            <Heading as="h3" size="md" noOfLines={1}>{product?.name}</Heading>
            <Text noOfLines={1}>{product?.description as string}</Text>
    
            <Text>{units} x {product?.price.toFixed(2)} €</Text>
          </Flex>
        </Center>
      </Box>
    </Flex>
  )
}