import "reflect-metadata";
import { Users } from "@/models";
import { UsersDto } from "../dto";
import { delay, inject, injectable } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { PrimsaWrapper } from "..";

const secureUserFields = {
  id: true,
  email: true,
  name: true,
  admin: true,
  password: false,
};

@injectable()
export class UsersService {
  readonly prismaClient: PrismaClient;

  constructor(
    @inject(delay(() => PrimsaWrapper)) primsaWrapper: PrimsaWrapper
  ) {
    this.prismaClient = primsaWrapper.client;
  }

  async upsertUser(user: UsersDto): Promise<Users> {
    return await this.prismaClient.users.upsert({
      where: {
        email: user.email,
      },
      update: user,
      create: user,
    });
  }

  async getUserByEmail(
    user: Partial<UsersDto>
  ): Promise<Partial<Users> | null> {
    return await this.prismaClient.users.findUnique({
      where: {
        email: user.email?.replaceAll('"', ""),
      },
      select: secureUserFields,
    });
  }

  async getUserById(user: Partial<UsersDto>): Promise<Partial<Users> | null> {
    return await this.prismaClient.users.findUnique({
      where: {
        id: user.id,
      },
      select: secureUserFields,
    });
  }

  async getAllUsers(): Promise<Partial<Users>[]> {
    return await this.prismaClient.users.findMany({
      select: secureUserFields,
    });
  }

  async deleteUser(user: Partial<UsersDto>): Promise<void> {
    await this.prismaClient.users.delete({
      where: {
        email: user.email,
      },
    });
  }
}
