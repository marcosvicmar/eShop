import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { container } from "tsyringe";
import { withAuthGuard } from "@/backend/guards";
import { RecommendsService } from "@/backend/service";

const recommendsService = container.resolve(RecommendsService);

async function getGlobalRecomendations(req: NextApiRequest, res: NextApiResponse) {
    try {
        const result = await recommendsService.getRecomendations()

        if (result !== null)  {
            res.status(StatusCodes.OK).json(result);
        }
    } catch(e) {
        res.status(StatusCodes.BAD_REQUEST);
    }
} 

const requestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            await getGlobalRecomendations(req, res);
            break;
        default:
            res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
                type: "error",
                message: ReasonPhrases.METHOD_NOT_ALLOWED
            });
    }
}

export default (req: NextApiRequest, res: NextApiResponse) => withAuthGuard(req, res, requestHandler);