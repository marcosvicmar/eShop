import "reflect-metadata";
import { Categories } from "@/models";
import { CategoriesDto, UsersDto } from "../dto";
import { delay, inject, injectable } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { PrimsaWrapper } from "..";

//He de fer el secureCategoryFields? És per a securitzar els seus camps no?
const secureCategoriesFields = {
  id: true, //Qins he de posar atrue i quins a false?
  createdAt: true, //Created i updated els he posat visibles, els hauria de posar a false per a que no els retorne?
  updatedAt: true,
  name: true,
  description: true,
  Products: true,
};

@injectable()
export class CategoriesService {
  readonly prismaClient: PrismaClient;

  constructor(
    @inject(delay(() => PrimsaWrapper)) prismaWrapper: PrimsaWrapper
  ) {
    this.prismaClient = prismaWrapper.client;
  }
  
  //Fer el upsert per a quan s'inserten noves categories
  async upsertCategory(category: CategoriesDto): Promise<Categories> {
    //Ho he fet per id, ja que és el camp clau, per nom no ho he fet perque no és clau única, crec que es poden repetir els noms, i per això no deixa
    return await this.prismaClient.categories.upsert({
      where: {
        id: category.id || -1,
      },
      update: category,
      create: category,
    });
  }

  async getCategoryById(
    category: Partial<CategoriesDto>
  ): Promise<Partial<Categories> | null> {
    return await this.prismaClient.categories.findUnique({
      where: {
        id: category.id || -1,
      },
      select: secureCategoriesFields,
    });
  }

  async getCategoryByName(
    category: Partial<CategoriesDto>
  ): Promise<Partial<Categories> | null> {
    return await this.prismaClient.categories.findFirst({
      where: {
        name: category.name?.replaceAll('"', ""),
      },
      select: secureCategoriesFields,
    });
  }
  //He de fer un findMany dels productes? O aixó ho he de fer al service de Product?
  //Ho deixe per a product, li trobe més sentit traure productes directament en la part de productes

  async getAllCategories(): Promise<Partial<Categories>[]> {
    return await this.prismaClient.categories.findMany({
      select: secureCategoriesFields,
    });
  }

  async deleteCategory(category: Partial<CategoriesDto>): Promise<void> {
    await this.prismaClient.categories.delete({
      where: {
        id: category.id || -1, //Ho he fet per id perque el nom no és unique
      },
    });
  }
}
