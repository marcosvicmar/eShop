import { Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Stack } from "@chakra-ui/react";
import { Products } from "@/models";

export interface ProductProps {
    product: Products
}

export const ProductCard: React.FC<ProductProps> = ({ product }) => {
    return (
        <Card key={product.id} maxW='sm'>
            <CardBody>
                <Stack mt='6' spacing='3'>
                    <Heading size='md'>{product.name}</Heading>
                    <p>{product.description}</p>
                    <p color='blue.600'>{product.price}</p>
                </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
                <ButtonGroup spacing='2'>
                    <Button variant='solid' colorScheme='blue'>
                        Buy now
                    </Button>
                    <Button variant='ghost' colorScheme='blue'>
                        Add to cart
                    </Button>
                </ButtonGroup>
            </CardFooter>
        </Card>
    )
}