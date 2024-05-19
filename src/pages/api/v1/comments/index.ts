import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { container } from "tsyringe";
import { withAuthGuard } from "@/backend/guards";
import { CommentsService } from "@/backend/service";

const commentsService = container.resolve(CommentsService);

async function postCommentMethod(req: NextApiRequest, res: NextApiResponse) {
    try {
        await commentsService.upsertComment(req.body);

        res.status(StatusCodes.OK).json({});
    } catch(e) {
        res.status(StatusCodes.BAD_REQUEST);
    }
}

const requestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            await postCommentMethod(req, res);
            break;
        default:
            res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
                type: "error",
                message: ReasonPhrases.METHOD_NOT_ALLOWED
            });
    }
}

export default (req: NextApiRequest, res: NextApiResponse) => withAuthGuard(req, res, requestHandler);