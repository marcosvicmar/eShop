import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Stack,
  CardHeader,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Products } from "../../../models/products.model";
import { useSession } from "@/providers/session.provider";
import { useRouter } from "next/router";
import Link from "next/link";

interface ProductItemProps {
  scale?: number;

  productObj: Products;
  showButtons: boolean;
  onBuyNow?: (product: Products) => void;
  onAddToCart?: (product: Products) => void;
}

export const ProductItem: React.FC<ProductItemProps> = ({
  scale = 1,

  productObj,
  showButtons = false,
  onBuyNow = () => {},
  onAddToCart = () => {},
}) => {
  const [product, setProduct] = useState<any | null>(null);
  const { token } = useSession();

  useEffect(() => {
    fetch(`/api/v1/products?id=${productObj.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, []);

  return (
    <Card maxW="sm" minH={"10rem"} minW={"25em"}>
      <Link href={`/products/${productObj.id}`}>
        <CardHeader>
          <img
            width={"100%"}
            src="https://placehold.it/300x200"
            alt="product image"
          />
        </CardHeader>
        <CardBody>
          <Stack mt="6" spacing="3">
            <Heading as="h2" size="md" noOfLines={1}>
              {product?.name}
            </Heading>
            <Text noOfLines={1}>{product?.description as string}</Text>
            <Text noOfLines={1} color="blue.600">
              {product?.price.toFixed(2)} €
            </Text>
          </Stack>
        </CardBody>
      </Link>
      <Divider />
      {showButtons && (
        <CardFooter>
          <ButtonGroup spacing="2">
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={() => onBuyNow(productObj)}
            >
              Buy now
            </Button>
            <Button
              variant="ghost"
              colorScheme="blue"
              onClick={() => onAddToCart(productObj)}
            >
              Add to cart
            </Button>
          </ButtonGroup>
        </CardFooter>
      )}
    </Card>
  );
};
