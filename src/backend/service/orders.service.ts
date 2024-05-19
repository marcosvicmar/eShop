import "reflect-metadata";
import { Orders } from "@/models";
import { OrdersDto } from "../dto";
import { CartsService, PrimsaWrapper } from "..";
import { delay, inject, injectable } from "tsyringe";
import { PrismaClient } from "@prisma/client";

const secureOrderFields = {
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: false,
  status: true,
  orderLine: true,
  name: true,
  surname: true,

  address: true,
  province: true,
  city: true,
  postalCode: true,
  country: true
};

@injectable()
export class OrdersService {
  readonly prismaClient: PrismaClient;

  constructor(
    @inject(delay(() => PrimsaWrapper)) primsaWrapper: PrimsaWrapper,
    @inject(delay(() => CartsService)) cartsService: CartsService
  ) {
    this.prismaClient = primsaWrapper.client;
  }

  async upsertOrder(order: OrdersDto): Promise<Orders> {
    return await this.prismaClient.orders.upsert({
      where: {
        id: order.id,
      },
      update: order,
      create: order,
    });
  }

  async convertCartToOrder(
    cartId: number,
    orderDto: Partial<OrdersDto>
  ): Promise<Orders> {
    let order = {} as Orders;

    try {
      const cart = await this.prismaClient.carts.findUnique({
        where: {
          id: cartId,
        },
        include: {
          cartLine: {
            include: {
              product: true,
            },
          },
        },
      });
  
       order = await this.prismaClient.orders.upsert({
        where: {
          id: orderDto.id || -1,
        },
        update: {
          status: "pending",
          updatedAt: new Date(),
  
          address: orderDto.address || "",
          city: orderDto.city || "",
          country: orderDto.country || "",
          province: orderDto.province || "",
        },
        create: {
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
  
          userId: cart?.userId || -1,
  
          name: orderDto.name || "",
          surname: orderDto.surname || "",
  
          address: orderDto.address || "",
          city: orderDto.city || "",
          country: orderDto.country || "",
          province: orderDto.province || "",
          postalCode: orderDto.postalCode || "",
        },
      });
  
      cart?.cartLine?.forEach(async (cartLine) => {
        console.log({
          data: {
            count: cartLine.count,
            productId: cartLine.productId,
            orderId: order.id,
          },
        });

        await this.prismaClient.ordersLine.create({
          data: {
            count: cartLine.count,
            productId: cartLine.productId,
            orderId: order.id,
          },
        });
      });
  
      await this.prismaClient.carts.delete({
        where: {
          id: cartId,
        },
      });
    } catch(e) {
      console.log(e);
    }

    return order;
  }

  async getOrdersByClient(clientId: number): Promise<Partial<Orders>[] | null> {
    return await this.prismaClient.orders.findMany({
      where: {
        userId: clientId,
      },
      select: secureOrderFields,
    });
  }

  async getOrderById(
    order: Partial<OrdersDto>
  ): Promise<Partial<Orders> | null> {
    return await this.prismaClient.orders.findUnique({
      where: {
        id: order.id,
      },
      select: secureOrderFields,
    });
  }

  async getAllOrders(): Promise<Partial<Orders>[]> {
    return await this.prismaClient.orders.findMany({
      select: secureOrderFields,
    });
  }

  async deleteOrder(order: Partial<OrdersDto>): Promise<void> {
    await this.prismaClient.orders.delete({
      where: {
        id: order.id,
      },
    });
  }

  async getTotalFromOrders(
    order: Partial<OrdersDto>
  ): Promise<[{ orderId: number; totalItems: number; totalPrice: number }]> {
    return await this.prismaClient.$queryRaw`
      SELECT
        o.id AS orderId,
        SUM(ol.count) AS totalItems,
        SUM(ol.count * p.price) AS totalPrice
      FROM
        Orders o
      JOIN
        OrdersLine ol ON o.id = ol.orderId
      JOIN
        Products p ON ol.productId = p.id
      WHERE
        o.id = ${order.id}
      GROUP BY
        o.id;
    `;
  }
}
