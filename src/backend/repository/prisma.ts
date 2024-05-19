import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import { injectable, singleton } from "tsyringe";

@singleton()
@injectable()
export class PrimsaWrapper{
    readonly client;
    
    constructor() {
        this.client = new PrismaClient();
    }
}