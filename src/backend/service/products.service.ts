import "reflect-metadata";
import { Products } from "@/models";
import { ProductsDto } from "../dto";
import { delay, inject, injectable } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { PrimsaWrapper } from "..";

const secureProductFields = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  description: true,
  price: true,
  comments: true,
  ratings: true,
  orders: false,
  carts: false,
  category: true,
};

@injectable()
export class ProductsService {
  readonly prismaClient: PrismaClient;

  constructor(
    @inject(delay(() => PrimsaWrapper)) primsaWrapper: PrimsaWrapper
  ) {
    this.prismaClient = primsaWrapper.client;
  }

  async upsertProduct(product: ProductsDto): Promise<Products> {
    return await this.prismaClient.products.upsert({
      where: {
        id: product.id || -1, //Pille per id perque és la clau primària, i no hi ha altra clau única com en users amb l'email
      },
      update: product,
      create: product,
    });
  }

  async getProductsById(
    product: Partial<ProductsDto>
  ): Promise<Partial<Products> | null> {
    return await this.prismaClient.products.findUnique({
      where: {
        id: product.id || -1,
      },
      select: secureProductFields,
    });
  }

  async getProductsByName(
    product: Partial<ProductsDto>
  ): Promise<Partial<Products>[]> {
    //Estic suposant que sols hi haurà un producte amb un nom, que no es repetiran els noms, i no és clau única, he de fer FindMany no?
    return await this.prismaClient.$queryRawUnsafe(
      `SELECT * FROM products WHERE name LIKE \'%${product.name}%\'`
    );
  }

  async getProductsByCategory(
    product: Partial<ProductsDto>
  ): Promise<Partial<Products>[]> {
    return await this.prismaClient.products.findMany({
      where: {
        categoryId: product.categoryId || -1,
      },
      select: secureProductFields,
    });
  }

  async getAllProducts(): Promise<Partial<Products>[]> {
    return await this.prismaClient.products.findMany({
      select: secureProductFields,
    });
  }

  async deleteProduct(product: Partial<ProductsDto>): Promise<void> {
    await this.prismaClient.products.delete({
      where: {
        id: product.id || -1,
      },
    });
  }
}
