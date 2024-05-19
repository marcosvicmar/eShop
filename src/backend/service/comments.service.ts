import "reflect-metadata";
import { Products } from "@/models";
import { CommentsDto, ProductsDto, RatingsDto } from "../dto";
import { delay, inject, injectable } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { PrimsaWrapper } from "..";

@injectable()
export class CommentsService {
  readonly prismaClient: PrismaClient;

  constructor(
    @inject(delay(() => PrimsaWrapper)) primsaWrapper: PrimsaWrapper
  ) {
    this.prismaClient = primsaWrapper.client;
  }

  async upsertComment(comments: CommentsDto): Promise<CommentsDto> {
    const result = await this.prismaClient.comments.findFirst({
      where: {
        productId: comments.productId,
        authorId: comments.authorId,
      },
    });

    return await this.prismaClient.comments.upsert({
      where: {
        id: result?.id || -1,
      },
      update: {
        body: comments.body || "",
        updatedAt: new Date(),
      },
      create: {
        body: comments.body || "",
        createdAt: new Date(),
        authorId: comments.authorId,
        productId: comments.productId,
      },
    });
  }
}
