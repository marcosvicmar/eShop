import "reflect-metadata";
import { withAuthGuard } from "@/backend/guards";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { container } from "tsyringe";
import { UsersService } from "@/backend/service";
import { UsersDto, authDecode } from "@/backend";

const usersService = container.resolve(UsersService);

async function getMeMethod(req: NextApiRequest, res: NextApiResponse) {
    const authHeader = req.headers.authorization as string;
    const [ email ] = authDecode(authHeader);

    const result = await usersService.getUserByEmail({
        email
    });

    res.status(StatusCodes.OK).json(result);
}

async function updateMeMethod(req: NextApiRequest, res: NextApiResponse) {
    const userData = req.body as UsersDto;

    const authHeader = req.headers.authorization as string;
    const [ email ] = authDecode(authHeader);

    const result = await usersService.upsertUser({ ...userData, email })
    
    res.status(StatusCodes.OK).json(result);
}

async function deleteMeMethod(req: NextApiRequest, res: NextApiResponse) {
    const authHeader = req.headers.authorization as string;
    const [ email ] = authDecode(authHeader);

    await usersService.deleteUser({
        email
    });

    res.status(StatusCodes.OK).end();
}

const requestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            await getMeMethod(req, res);
            break;
        case 'PUT':
            await updateMeMethod(req, res);
            break;
        case 'DELETE':
            await deleteMeMethod(req, res);
            break;
        default:
            res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
                type: "error",
                message: ReasonPhrases.METHOD_NOT_ALLOWED
            });
    }
};

export default (req: NextApiRequest, res: NextApiResponse) => withAuthGuard(req, res, requestHandler);
