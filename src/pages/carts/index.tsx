import { useEffect, useState } from 'react';
import { useCartProvider, useSession } from '@/providers';
import { Table, Thead, Tbody, Tr, Th, Td, useToast } from '@chakra-ui/react';
import { Carts } from '@/models';
import { ShopSkeleton } from '@/components';
import Link from 'next/link';

const CartTableRaw: React.FC<{ cart: Carts }> = ({ cart }) => {
  const { getTotalCart, removeEntireCart } = useCartProvider();
  const [ totalPrice, setTotalPrice ] = useState<number>(0);
  const toast = useToast();


  const handleDeleteCart = (cartId: number) => {
    removeEntireCart(cartId).then(() => {
      toast({
        title: "Cart deleted",
        description: `The cart ${cartId} has been deleted successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    }).catch(() => {
      toast({
        title: "Error",
        description: "An error has ocurred during delete.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    });
  };

  useEffect(() => {
    getTotalCart(cart.id).then((data) => setTotalPrice(data?.totalPrice || 0));
  }, []);

  return (
     <Tr key={cart.id}>
      <Td><Link href={`/carts/${cart.id}`}>{cart.id}</Link></Td>
      <Td><Link href={`/carts/${cart.id}`}>{(new Date(cart.createdAt)).toUTCString()}</Link></Td>
      <Td><Link href={`/carts/${cart.id}`}>{(new Date(cart.updatedAt)).toUTCString()}</Link></Td>
      <Td><Link href={`/carts/${cart.id}`}>{totalPrice.toFixed(2)} €</Link></Td>
          
      <Td>
        <button onClick={() => handleDeleteCart(cart.id)}>Eliminar</button>
      </Td>
    </Tr>
  );
}

const CartList = () => {
  const [carts, setCarts] = useState<Carts[]>([]);
  const { getCartsByUserEmail, loading: cartLoading } = useCartProvider();

  useEffect(() => {
    if (!cartLoading) {
      getCartsByUserEmail().then((carts) => {
        if (carts !== undefined && (carts as any).type !== "error") {
          setCarts(carts);
        }
      });
    }
  }, [cartLoading]);

  if (cartLoading) return <ShopSkeleton />;

  return (
    <ShopSkeleton>
      <Table>
        <Thead>
          <Tr>
            <Th>Identificador</Th>
            <Th>Fecha de creación</Th>
            <Th>Fecha de actualización</Th>
            <Th>Total del carrito</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {carts.map((cart) => <CartTableRaw cart={cart} />)}
        </Tbody>
      </Table>
    </ShopSkeleton>
  );
};

export default CartList;
