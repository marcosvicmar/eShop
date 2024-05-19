import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { Carts, CartsItem, Products } from "@prisma/client";
import { useRouter } from "next/router";

import { useSession } from "./session.provider";

type CartTotal = {
  totalPrice: number;
  totalItems: number;
};

interface SessionProps {
  children?: ReactNode;
}

interface CartSchema {
  getCart: (cartId: number) => Promise<Carts | undefined>;
  getTotalCart: (cartId: number) => Promise<CartTotal | undefined>;
  getCartsByUserEmail: () => Promise<Carts[]>;
  addToCart: (cartItems: Partial<CartsItem>, cartId?: number) => Promise<void>;
  buyNowProduct: (cartItems: Partial<CartsItem>) => Promise<void>;
  removeFromCart: (cartId: number, product: Products) => Promise<void>;
  removeEntireCart: (cartId: number) => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartSchema>({
  getCart: (cartId: number) => Promise.resolve(undefined),
  getTotalCart: (cartId: number) => Promise.resolve(undefined),
  getCartsByUserEmail: () => Promise.resolve([]),
  addToCart: (cartItems: Partial<CartsItem>, cartId?: number) =>Promise.resolve(),
  buyNowProduct: (cartItems: Partial<CartsItem>) => Promise.resolve(),
  removeFromCart: (cartId: number, product: Products) => Promise.resolve(),
  removeEntireCart: (cartId: number) => Promise.resolve(),
  loading: false,
});

export default function CartProvider({ children }: SessionProps) {
  const { token, currentUser, loading } = useSession();
  const { push } = useRouter();

  const getCart = useCallback(
    async (cartId: number) => {
      const result = await fetch(`/api/v1/carts?id=${cartId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      });

      return (await result.json()) as Carts;
    },
    [token]
  );

  const getTotalCart = useCallback(
    async (cartId: number) => {
      const result = await fetch(
        `/api/v1/carts?totalPrice=true&cartId=${cartId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
          },
        }
      );

      return (await result.json()) as CartTotal;
    },
    [token]
  );

  const getCartsByUserEmail = useCallback(async () => {
    const result = await fetch(
      `/api/v1/carts?userEmail=${currentUser?.email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      }
    );

    return (await result.json()) as Carts[];
  }, [currentUser, token]);

  const addToCart = useCallback(
    async (cartItems: Partial<CartsItem>, cartId?: number) => {
      let resultCartId = cartId || -1;

      if (cartId === undefined) {
        const result: Carts[] = await (
          await fetch(`/api/v1/carts?userEmail=${currentUser?.email}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${token}`,
            },
          })
        ).json();

        if (result.length > 0) {
          resultCartId = result[0].id;
        } else {
          const result = await fetch(`/api/v1/carts`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${token}`,
            },
            body: JSON.stringify({
              userId: currentUser?.id,
            }),
          });

          resultCartId = (await result.json()).id;
        }
      }

      await fetch(`/api/v1/carts?id=${resultCartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify(
          [cartItems].map((obj) => {
            obj.cartId = resultCartId;
            return obj;
          })
        ),
      });

      return;
    },
    [token]
  );

  const buyNowProduct = useCallback(
    async (cartItems: Partial<CartsItem>) => {
      const result = await fetch(`/api/v1/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify({
          userId: currentUser?.id,
        }),
      });

      const resultCartId = (await result.json()).id || -1;

      await fetch(`/api/v1/carts?id=${resultCartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify(
          [cartItems].map((obj) => {
            obj.cartId = resultCartId;
            return obj;
          })
        ),
      });

      push(`/carts/${resultCartId}`);
    },
    [token]
  );

  const removeFromCart = useCallback(
    async (cartId: number, product: Products) => {
      await fetch(`/api/v1/carts?id=${cartId}&productId=${product.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      });

      return;
    },
    [token]
  );

  const removeEntireCart = useCallback(
    async (cartId: number) => {
      await fetch(`/api/v1/carts?id=${cartId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      });
    },
    [token]
  );

  const value = useMemo(
    () => ({
      getCart,
      getTotalCart,
      getCartsByUserEmail,
      addToCart,
      buyNowProduct,
      removeFromCart,
      removeEntireCart,
      loading,
    }),
    [
      getCart,
      getTotalCart,
      getCartsByUserEmail,
      addToCart,
      buyNowProduct,
      removeFromCart,
      removeEntireCart,
      loading,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartProvider() {
  const context = useContext(CartContext);

  if (!context)
    throw new Error(`useSession must be used within ${CartProvider.name}`);

  return context;
}

export function withCartProvider(Component: React.FC<any>) {
  return function WrapperComponent(props: {}) {
    return (
      <CartProvider>
        <Component {...props} />
      </CartProvider>
    );
  };
}
