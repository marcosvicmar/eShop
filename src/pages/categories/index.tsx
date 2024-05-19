
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useSession } from '@/providers/session.provider';
import { Box, Center, Heading, Link, Text, VStack, LinkBox, LinkOverlay, SimpleGrid } from '@chakra-ui/react';
import { ShopSkeleton } from '@/components/layouts/shop-skeleton';
import { Categories } from '@/models';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const { push } = useRouter();

  const { token, loading, isLogged } = useSession();

  useEffect(() => {
      if (!isLogged && !loading) push('/login');
  }, [loading, isLogged]);
  
  useEffect(() => {
      fetch(`/api/v1/categories`, {
          method: 'GET',
          headers: {
              'Authorization': `Basic ${token}`,
              'Content-Type': 'application/json',
          },
      })
          .then((res) => res.json())
          .then((data) => {
              setCategories(data.type === 'error' ? [] : data)
          });
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    return `/categories/${categoryId}`;
  };

  if (!isLogged && !loading) {
    return (
      <ShopSkeleton>
        <Text>Not logged</Text>
      </ShopSkeleton>
    );
  }

  if (loading) {
    return (
      <ShopSkeleton>
        <Text>Loading...</Text>
      </ShopSkeleton>
    );
  }

  return (
    <ShopSkeleton>
      <SimpleGrid columns={3} spacing={10}>
        {categories.map((category) => (
          <LinkBox key={category.id} p={5} shadow="md" borderWidth="1px" rounded="md">
            <LinkOverlay as={NextLink} href={`/categories/${category.id}`}>
              <VStack align="start" spacing={2}>
                <Heading size="md">{category.name}</Heading>
                <Text>{category.description}</Text>
              </VStack>
            </LinkOverlay>
          </LinkBox>
        ))}
      </SimpleGrid>
    </ShopSkeleton>
  );
};

export default CategoriesPage;
