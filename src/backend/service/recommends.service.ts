import "reflect-metadata";
import { Products } from "@/models";
import { ProductsDto } from "../dto";
import { delay, inject, injectable } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { PrimsaWrapper } from "..";

@injectable()
export class RecommendsService {
  readonly prismaClient: PrismaClient;

  constructor(
    @inject(delay(() => PrimsaWrapper)) primsaWrapper: PrimsaWrapper
  ) {
    this.prismaClient = primsaWrapper.client;
  }

  async getRecomendations(): Promise<Products[]> {
    return await this.prismaClient.$queryRawUnsafe(
      `SELECT * FROM products WHERE id IN (SELECT productId FROM Ratings WHERE rating >= 1) LIMIT 3;`
    );
  }
}
