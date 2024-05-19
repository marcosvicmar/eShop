import { ShopSkeleton } from "@/components";
import { ProductGrid } from "@/components/products";
import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { useSession } from "@/providers/session.provider";

export default function IndexPage() {
    const { loading } = useSession();

    if (loading) return <ShopSkeleton />;

    return (
        <ShopSkeleton>
            <Container
                minW={"85vw"}
                minH={"40vh"}
                maxW={"100rem"}
                margin={"0 auto 2em auto"}
                backgroundColor={"#555"}
            >
                <Box style={{
                    position: "relative",
                    top: "10rem",
                    margin: "0 2em",
                }}>
                    <Heading color={"white"}>
                        Shop Commerce
                    </Heading>
                    <Text color={"white"}>
                        Welcome to Shop Commerce, the best place to buy your photography equipment.
                    </Text>
                </Box>

            </Container>
            <ProductGrid />
        </ShopSkeleton>
    );
}
