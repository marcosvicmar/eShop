import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { CategoriesService } from "@/backend";
import { container } from "tsyringe";
import { withAdminGuard, withAuthGuard } from "@/backend/guards";

const categoriesService = container.resolve(CategoriesService);

async function getCategoriesMethod(req: NextApiRequest, res: NextApiResponse) {
    if (req.query.id !== undefined) {
        const categoryId = parseInt(req.query.id as string, 10);//Primer el passe a número perque el id és un número 
        
        if(!isNaN(categoryId)){//Comprove que ha pogut fer la conversió, aleshores ja faig la consulta per id
            const result = await categoriesService.getCategoryById({
                id: categoryId,
            })

            if (result !== null)  {
                res.status(StatusCodes.OK).json(result);

                return;
            }
        }
    } else if (req.query.name !== undefined) {
        const result = await categoriesService.getCategoryByName({
            name: req.query.name as string,
        })

        if (result !== null)  {
            res.status(StatusCodes.OK).json(result);

            return;
        }
    } else {
        const result = await categoriesService.getAllCategories();

        if (result.length > 0) {
            res.status(StatusCodes.OK).json(result);
        
            return;
        }
    }

    res.status(StatusCodes.NOT_FOUND);
} 

async function postCategoryMethod(req: NextApiRequest, res: NextApiResponse) {
    try {
        const result = await categoriesService.upsertCategory(req.body);

        res.status(StatusCodes.OK).json(result);
    } catch(e) {
        res.status(StatusCodes.BAD_REQUEST);
    }
}

async function deleteCategoryMethod(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.query.id !== undefined) {

            const categoryId = parseInt(req.query.id as string, 10);//Primer el passe a número perque el id és un número 

            if(!isNaN(categoryId)){
                const result = await categoriesService.deleteCategory({
                    id: categoryId
                });

                res.status(StatusCodes.OK);

                return;
            }
        }

        res.status(StatusCodes.BAD_REQUEST);
    } catch(e) {
        res.status(StatusCodes.BAD_REQUEST);
    }
}

const requestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            await getCategoriesMethod(req, res);
            break;
        case 'POST':
            await withAdminGuard(req, res, () => postCategoryMethod(req, res));
            break;
        case 'DELETE':
            await withAdminGuard(req, res, () => deleteCategoryMethod(req, res));
            break;
        default:
            res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
                type: "error",
                message: ReasonPhrases.METHOD_NOT_ALLOWED
            });
    }
}

export default (req: NextApiRequest, res: NextApiResponse) => withAuthGuard(req, res, requestHandler);