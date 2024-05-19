import { ProductGrid, ProductItem, ShopSkeleton } from "@/components";
import { Container, Heading } from "@chakra-ui/react";

export default function IndexPage() {
    return (
        <ShopSkeleton>
            <Container>
                <Heading 
                    as="h2"
                    size="xl"
                    textAlign="center"
                    mb="2rem"
                >
                    Products
                </Heading>
                <ProductGrid />
            </Container>

        </ShopSkeleton>
    );
}
