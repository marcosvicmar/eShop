import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { container } from "tsyringe";
import { withAuthGuard } from "@/backend/guards";
import { RatingsService } from "@/backend/service";

const ratingsService = container.resolve(RatingsService);

async function getGlobalRating(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.query.productId !== undefined) {
            const productId = parseInt(req.query.productId as string, 10);//Primer el passe a número perque el id és un número 
            
            if(!isNaN(productId)){//Comprove que ha pogut fer la conversió, aleshores ja faig la consulta per id
                const result = await ratingsService.getRatingsByProductId({
                    id: productId,
                })

                if (result !== null)  {
                    res.status(StatusCodes.OK).json(result);
                }
            }
        } else {
            res.status(StatusCodes.NOT_FOUND);
        }

        res.status(StatusCodes.NOT_FOUND);
    } catch(e) {
        res.status(StatusCodes.BAD_REQUEST);
    }
} 

async function postProductsMethod(req: NextApiRequest, res: NextApiResponse) {
    try {
        await ratingsService.upsertRating(req.body);

        res.status(StatusCodes.OK).json({});
    } catch(e) {
        res.status(StatusCodes.BAD_REQUEST);
    }
}

const requestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            await getGlobalRating(req, res);
            break;
        case 'POST':
            await postProductsMethod(req, res);
            break;
        default:
            res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
                type: "error",
                message: ReasonPhrases.METHOD_NOT_ALLOWED
            });
    }
}

export default (req: NextApiRequest, res: NextApiResponse) => withAuthGuard(req, res, requestHandler);