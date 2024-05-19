import "reflect-metadata";
import { Carts } from "@/models";
import { CartsDto, ProductsDto } from "../dto";
import { PrimsaWrapper } from "..";
import { delay, inject, injectable } from "tsyringe";
import { CartsItem, PrismaClient } from "@prisma/client";

const secureCartFields = {
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  cartLine: true,
};

@injectable()
export class CartsService {
  readonly prismaClient: PrismaClient;

  constructor(
    @inject(delay(() => PrimsaWrapper)) primsaWrapper: PrimsaWrapper
  ) {
    this.prismaClient = primsaWrapper.client;
  }

  async upsertCart(cart: CartsDto): Promise<Carts> {
    return await this.prismaClient.carts.upsert({
      where: {
        id: cart.id || -1,
      },
      update: cart,
      create: cart,
    });
  }

  async getCartById(cart: Partial<CartsDto>): Promise<Partial<Carts> | null> {
    return await this.prismaClient.carts.findUnique({
      where: {
        id: cart.id,
      },
      select: secureCartFields,
    });
  }

  async getCartsByUserId(
    cart: Partial<CartsDto>
  ): Promise<Partial<Carts[]> | null> {
    return await this.prismaClient.carts.findMany({
      where: {
        userId: cart.userId,
      },
      select: secureCartFields,
    });
  }

  async getAllCarts(): Promise<Partial<Carts>[]> {
    return await this.prismaClient.carts.findMany({
      select: secureCartFields,
    });
  }

  async addProductToCart(cartItems: CartsItem[]): Promise<void> {
    await Promise.allSettled(
      cartItems.map(async (cartItem) => {
        await this.prismaClient.cartsItem.create({
          data: cartItem,
        });
      })
    );
  }

  async deleteCart(cart: Partial<CartsDto>): Promise<void> {
    await this.prismaClient.cartsItem.deleteMany({
      where: {
        cartId: cart.id
      }
    });
    
    await this.prismaClient.carts.delete({
      where: {
        id: cart.id,
      },
    });
  }

  async deleteProductFromCart(
    cart: Partial<CartsDto>,
    product: Partial<ProductsDto>
  ): Promise<void> {
    await this.prismaClient
      .$queryRaw`DELETE FROM "CartsItem" WHERE "cartId" = ${cart.id} AND "productId" = ${product.id}`;
  }

  async getTotalFromCart(
    cart: Partial<CartsDto>
  ): Promise<[{ cartId: number; totalItems: number; totalPrice: number }]> {
    return await this.prismaClient.$queryRaw`
      SELECT
        c.id AS cartId,
        SUM(ci.count) AS totalItems,
        SUM(ci.count * p.price) AS totalPrice
      FROM
        Carts c
      JOIN
        CartsItem ci ON c.id = ci.cartId
      JOIN
        Products p ON ci.productId = p.id
      WHERE
        c.id = ${cart.id}
      GROUP BY
        c.id;
    `;
  }
}
