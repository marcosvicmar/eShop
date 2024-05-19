import { useEffect, useState } from 'react';
import { useOrderProvider, withOrderProvider } from '@/providers';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { Orders } from '@/models';
import { ShopSkeleton } from '@/components';
import Link from "next/link";

const OrdersTableRaw: React.FC<{ order: Orders }> = ({ order }) => {
  const { getTotalOrder } = useOrderProvider();
  const [ totalPrice, setTotalPrice ] = useState<number>(0);

  useEffect(() => {
    getTotalOrder(order.id).then((data) => setTotalPrice(data?.totalPrice || 0))
  }, []);

  return (
     <Tr key={order.id}>
      <Td><Link href={`/orders/${order.id}`}>{order.id}</Link></Td>
      <Td><Link href={`/orders/${order.id}`}>{(new Date(order.createdAt)).toUTCString()}</Link></Td>
      <Td><Link href={`/orders/${order.id}`}>{(new Date(order.updatedAt)).toUTCString()}</Link></Td>
      <Td><Link href={`/orders/${order.id}`}>{totalPrice.toFixed(2)} €</Link></Td>
    </Tr>
  );
}

const orderList = () => {
  const [orders, setOrders] = useState<Orders[]>([
    {
      id: 2,
      createdAt: new Date(1702338381),
      updatedAt: new Date(1702338381),
      address: "Calle de la piruleta",
      city: "Madrid",
      country: "España",
      postalCode: "28001",
      province: "Madrid",
      status: "Pending",
      name: "Roberto",
      surname: "Gimenez Sanchez",
      userId: 1,
    }
  ]);
  const { listOrdersByUserEmail, loading: ordersLoading } = useOrderProvider();

  useEffect(() => {
    if (!ordersLoading) {
      listOrdersByUserEmail().then((orders) => {
        if (orders !== undefined && (orders as any).type !== "error") {
          setOrders(orders)
        }
      });
    }
  }, [ordersLoading]);

  if (ordersLoading) return <ShopSkeleton />;
  
  return (
    <ShopSkeleton>
      <Table>
        <Thead>
          <Tr>
            <Th>Identificador</Th>
            <Th>Fecha de creación</Th>
            <Th>Fecha de actualización</Th>
            <Th>Total del pedido</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => <OrdersTableRaw key={order.id} order={order} />)}
        </Tbody>
      </Table>
    </ShopSkeleton>
  );
};

export default withOrderProvider(orderList);
