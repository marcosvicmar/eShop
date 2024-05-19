import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import { delay, inject, injectable } from "tsyringe";
import { PrimsaWrapper } from "..";

@injectable()
export class AuthService {
  readonly prismaClient: PrismaClient;

  constructor(
    @inject(delay(() => PrimsaWrapper)) primsaWrapper: PrimsaWrapper
  ) {
    this.prismaClient = primsaWrapper.client;
  }

  async validateLogin(email: string, password: string): Promise<boolean> {
    const result = await this.prismaClient.users.findFirst({
      where: {
        email: email,
      },
    });

    return result !== null && result.password === password;
  }

  async validateAdmin(email: string): Promise<boolean> {
    const result = await this.prismaClient.users.findFirst({
      where: {
        email: email,
      },
    });

    return result !== null && result.admin;
  }
}
