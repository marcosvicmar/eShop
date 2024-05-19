
import { Box, Heading, Text, Center } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ShopSkeleton } from '../../components/layouts';
import { Orders } from '@/models';
import { OrdersLine } from '@prisma/client';
import { SmallIndividualProduct } from '@/components/carts';
import { useOrderProvider, withOrderProvider } from '@/providers';
import { getName } from 'country-list';

const OrderDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Orders | undefined>(undefined);
  const { getOrderById } = useOrderProvider();

  useEffect(() => {
    getOrderById(parseInt(id as string)).then((order: Orders) => {
        setOrder(order);
        setLoading(false);
    });
  }, []);

  if (loading) return <ShopSkeleton />;

  return (
    <ShopSkeleton>
      <Center>
        <Box>
          <Heading as="h1" size="xl" mb={4}>
            Detalles del pedido #{id}
          </Heading>

          <Box mb={4}>
            <Heading as="h2" size="lg" mb={2}>
              Datos de Facturación
            </Heading>
            <Text>Name: {order?.name} {order?.surname}</Text>
          </Box>

          <Box mb={4}>
            <Heading as="h2" size="lg" mb={2}>
              Datos de Envío
            </Heading>
            <Text>Address: {order?.address}</Text>
            <Text>Province: {order?.province}</Text>
            <Text>Country: {getName(order?.country.toUpperCase() || "")}</Text>
            <Text>Postal Code: {order?.postalCode}</Text>
          </Box>

          <Box mb={4}>
            <Heading as="h2" size="lg" mb={2}>
              Estado del Pedido
            </Heading>
            <Text>{order?.status}</Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={2}>
              Productos Comprados
            </Heading>
            {(order as any).orderLine?.map((orderLine: OrdersLine) => (
                <SmallIndividualProduct 
                    key={orderLine.productId} 
                    productId={orderLine.productId} 
                    units={orderLine.count}
                />
            ))}
          </Box>
        </Box>
      </Center>
    </ShopSkeleton>
  );
};

export default withOrderProvider(OrderDetailsPage);
