import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { UsersService } from "@/backend";
import { container } from "tsyringe";
import { withAdminGuard, withAuthGuard } from "@/backend/guards";

const usersService = container.resolve(UsersService);

async function getUserMethod(req: NextApiRequest, res: NextApiResponse) {
    if (req.query.email !== undefined) {
        const result = await usersService.getUserByEmail({
            email: req.query.email as string,
        })

        if (result !== null)  {
            res.status(StatusCodes.OK).json(result);

            return;
        }
    } else if (req.query.id !== undefined) {
        const result = await usersService.getUserById({
            id: parseInt(req.query.id as string),
        })

        if (result !== null)  {
            res.status(StatusCodes.OK).json(result);

            return;
        }
    } else {
        const result = await usersService.getAllUsers();

        if (result.length > 0) {
            res.status(StatusCodes.OK).json(result);
        
            return;
        }
    }

    res.status(StatusCodes.NOT_FOUND);
} 

async function postUserMethod(req: NextApiRequest, res: NextApiResponse) {
    try {
        const result = await usersService.upsertUser(req.body);

        res.status(StatusCodes.OK).json(result);
    } catch(e) {
        res.status(StatusCodes.BAD_REQUEST);
    }
}

async function deleteUserMethod(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.query.email !== undefined) {
            const result = await usersService.deleteUser({
                email: req.query.email as string
            });

            res.status(StatusCodes.OK);

            return;
        }

        res.status(StatusCodes.BAD_REQUEST);
    } catch(e) {
        res.status(StatusCodes.BAD_REQUEST);
    }
}

const requestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            await getUserMethod(req, res);
            break;
        case 'POST':
            await withAdminGuard(req, res, postUserMethod);
            break;
        case 'DELETE':
            await withAdminGuard(req, res, deleteUserMethod);
            break;
        default:
            res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
                type: "error",
                message: ReasonPhrases.METHOD_NOT_ALLOWED
            });
    }
}

export default (req: NextApiRequest, res: NextApiResponse) => withAuthGuard(req, res, requestHandler);
