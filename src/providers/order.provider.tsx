import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { Orders } from "@/models";
import { useRouter } from "next/router";
import { useSession } from "./session.provider";

type OrderTotal = {
  totalPrice: number;
  totalItems: number;
};

interface OrderProviderProps {
  children?: ReactNode;
}

interface OrderProviderSchema {
  convertCartToOrder: (
    cartId: number,
    orderDto: Partial<Orders>
  ) => Promise<void>;
  removeOrder: (orderId: number) => Promise<void>;
  listOrdersByUserEmail: () => Promise<Orders[]>;
  getOrderById: (orderId: number) => Promise<Orders>;
  getTotalOrder: (orderId: number) => Promise<OrderTotal>;
  loading: boolean;
}

const OrderContext = createContext<OrderProviderSchema>({
  convertCartToOrder: (cartId: number, orderDto: Partial<Orders>) =>
    Promise.resolve(undefined),
  removeOrder: (orderId: number) => Promise.resolve(undefined),
  listOrdersByUserEmail: () => Promise.resolve([]),
  getOrderById: (orderId: number) => Promise.resolve({} as Orders),
  getTotalOrder: (orderId: number) => Promise.resolve({} as OrderTotal),
  loading: false,
});

export default function OrderProvider({ children }: OrderProviderProps) {
  const { token, currentUser, loading } = useSession();
  const { push } = useRouter();

  const convertCartToOrder = useCallback(
    async (cartId: number, orderDto: Partial<Orders>) => {
      const result = await fetch(`/api/v1/orders?cartId=${cartId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify(orderDto),
      });

      const resultJson = await result.json();

      push(`/orders/${resultJson.id || 2}`);
    },
    [token]
  );

  const removeOrder = useCallback(
    async (orderId: number) => {
      await fetch(`/api/v1/orders?id=${orderId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      });
    },
    [token]
  );

  const listOrdersByUserEmail = useCallback(async () => {
    const result = await fetch(
      `/api/v1/orders?email=${currentUser?.email}`, 
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      }
    );

    const resultJson = await result.json();

    return resultJson as Orders[];
  }, [currentUser, token]);

  const getOrderById = useCallback(
    async (orderId: number) => {
      const result = await fetch(`/api/v1/orders?id=${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      });

      return (await result.json()) as Orders;
    },
    [token]
  );

  const getTotalOrder = useCallback(
    async (orderId: number) => {
      const result = await fetch(
        `/api/v1/orders?totalPrice=true&orderId=${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
          },
        }
      );

      return (await result.json()) as OrderTotal;
    },
    [token]
  );

  const value = useMemo(
    () => ({
      convertCartToOrder,
      removeOrder,
      listOrdersByUserEmail,
      getOrderById,
      getTotalOrder,
      loading,
    }),
    [
      convertCartToOrder,
      removeOrder,
      listOrdersByUserEmail,
      getOrderById,
      getTotalOrder,
      loading
    ]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrderProvider() {
  const context = useContext(OrderContext);

  if (!context)
    throw new Error(
      `useOrderProvider must be used within ${OrderProvider.name}`
    );

  return context;
}

export function withOrderProvider(Component: React.FC<any>) {
  return function WrapperComponent(props: {}) {
    return (
      <OrderProvider>
        <Component {...props} />
      </OrderProvider>
    );
  };
}
