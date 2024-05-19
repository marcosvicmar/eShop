import { ShopSkeleton } from "@/components/layouts";
import { ProductRecommends } from "@/components/products";
import {Rating, Comment} from "@/components/shared";
import { useCartProvider, withCartProvider } from "@/providers";
import { useSession } from "@/providers/session.provider";

import { Button, Container, Flex, Center, Heading, Stat, StatNumber, VStack, Textarea } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect, use, useCallback, useRef } from "react";

export function IndividualProduct() {
    const { query } = useRouter();
    const { token, currentUser } = useSession();
    const { buyNowProduct, addToCart } = useCartProvider();

    const commentRef = useRef<HTMLTextAreaElement>(null);

    const [product, setProduct] = useState<any | null>(null);
    const [rating, setRating] = useState<number>(0);

    const publishComment = useCallback((comment: string) => {
        return fetch(`/api/v1/comments`, {
            method: 'POST',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Basic ${token}`
            },
            body: JSON.stringify({
                productId: parseInt(query.id as string),
                authorId: currentUser?.id,
                body: comment
            })
        }).then(getComments);
    }, []);

    const publishRating = useCallback((rating: number) => {
        fetch(`/api/v1/ratings`, {
            method: 'POST',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Basic ${token}`
            },
            body: JSON.stringify({
                productId: parseInt(query.id as string),
                authorId: currentUser?.id,
                rating: rating
            })
        }).then(getAvgRating);
    }, []);

    const getAvgRating = useCallback(() => {
        fetch(`/api/v1/ratings?productId=${query.id}`, {
            method: 'GET',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Basic ${token}`
            }
        })        
        .then(res => res.json())
        .then(data => {
            setRating(data[0]?.global_rating)
        });
    }, [query, publishRating]);

    const getComments = useCallback(() => {
        fetch(`/api/v1/products?id=${query.id}`, {
            method: 'GET',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Basic ${token}`
            }
        })
        .then(res => res.json())
        .then(data => setProduct(data));
    }, [query, publishComment]);

    useEffect(() => {
        getComments();
        getAvgRating();
    }, []);

    return (
        <ShopSkeleton>
            <Container maxW='7xl'>
                <Flex>
                    <img width={400} height={400} src="http://placehold.it/400x400" />
                    <Flex direction="column" ml="2rem" gap={"1rem"}>
                        <Heading size='2xl' noOfLines={1}>{product?.name}</Heading>
                        <p>
                            {product?.description}
                        </p>
                        <Rating
                            rating={rating}
                            ratingClick={publishRating}
                        />
                        <Stat>
                            <StatNumber>{product?.price} €</StatNumber>
                        </Stat>
                        <Flex direction={"row"} >
                            <Button onClick={() => {
                                addToCart({
                                    productId: product?.id,
                                    count: 1
                                })
                            }}>Add to Cart</Button>
                            <Button ml={"1rem"} onClick={() => {
                                buyNowProduct({
                                    productId: product?.id,
                                    count: 1
                                })
                            }}>Buy Now</Button>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex direction={"column"} padding={0}>
                    <Heading size='lg' mt={"2rem"}>Recommendations</Heading>
                    <Center>
                        <ProductRecommends />
                    </Center>
                </Flex>
                <Flex direction={"column"}>
                    <Heading size='lg' mt={'2rem'}>Comments</Heading>
                    <VStack>
                        {
                            product?.comments?.length !== 0 ? (
                                product?.comments?.map((comment: any) => {
                                    return (
                                        <Comment
                                            userId={comment.authorId}
                                            date={(new Date(comment?.createdAt)).toUTCString()}
                                            comment={comment?.body}

                                        />
                                    )
                                }) 
                            ) : <p>No comments yet</p>
                        }
                    </VStack>
                </Flex>
                <Flex direction={"column"}>
                    <Heading size='lg' mt={'2rem'}>Add a comment</Heading>
                    <Container p={4} minH={"5rem"} minW={"100%"} borderWidth="1px" borderRadius="lg">
                        <Textarea ref={commentRef} rows={10} cols={100} minH={"5rem"} minW={"100%"}  />
                        <Center>
                            <Button mt={"1rem"} onClick={() => {
                                if (commentRef.current?.value) {
                                    publishComment(commentRef.current?.value);
                                } else {
                                    alert("Please, write a comment");
                                }
                            }}>Submit</Button>
                        </Center>
                    </Container>
                </Flex>
            </Container>
        </ShopSkeleton>
    );
}

export default withCartProvider(IndividualProduct);