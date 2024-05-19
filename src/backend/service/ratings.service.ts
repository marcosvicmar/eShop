import "reflect-metadata";
import { Products } from "@/models";
import { ProductsDto, RatingsDto } from "../dto";
import { delay, inject, injectable } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { PrimsaWrapper } from "..";

@injectable()
export class RatingsService {
  readonly prismaClient: PrismaClient;

  constructor(
    @inject(delay(() => PrimsaWrapper)) primsaWrapper: PrimsaWrapper
  ) {
    this.prismaClient = primsaWrapper.client;
  }

  async upsertRating(rating: RatingsDto): Promise<RatingsDto> {
    const result = await this.prismaClient.ratings.findFirst({
      where: {
        productId: rating.productId,
        authorId: rating.authorId,
      },
    });

    return await this.prismaClient.ratings.upsert({
      where: {
        id: result?.id || -1,
      },
      update: {
        rating: rating.rating || 0,
        updatedAt: new Date(),
      },
      create: {
        rating: rating.rating || 0,
        createdAt: new Date(),
        authorId: rating.authorId,
        productId: rating.productId,
      },
    });
  }

  async getRatingsByProductId(
    product: Partial<ProductsDto>
  ): Promise<{ global_rating: number }> {
    return await this.prismaClient.$queryRawUnsafe(
      `SELECT avg(rating) AS global_rating FROM Ratings WHERE productId = ${product.id};`
    );
  }
}
