import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ProductsService } from "@/backend";
import { container } from "tsyringe";
import { withAdminGuard, withAuthGuard } from "@/backend/guards";

const productsService = container.resolve(ProductsService);

async function getProductsMethod(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.query.id !== undefined) {
            const productId = parseInt(req.query.id as string, 10);//Primer el passe a número perque el id és un número 
            
            if(!isNaN(productId)){//Comprove que ha pogut fer la conversió, aleshores ja faig la consulta per id
                const result = await productsService.getProductsById({
                    id: productId,
                })

                if (result !== null)  {
                    res.status(StatusCodes.OK).json(result);
                }
            }
        } else if (req.query.name !== undefined) {
            const result = await productsService.getProductsByName({
                name: req.query.name as string,
            })

            if (result !== null)  {
                res.status(StatusCodes.OK).json(result);
            }
        } else if (req.query.categoryId !== undefined) {//Per al get per categories ho he fet que reba ordersId pel get
            const categoryId = parseInt(req.query.categoryId as string, 10);//Primer el passe a número perque el id és un número 
            
            if(!isNaN(categoryId)){//Comprove que ha pogut fer la conversió, aleshores ja faig la consulta per id
                const result = await productsService.getProductsByCategory({
                    id: categoryId,
                })

                if (result !== null)  {
                    res.status(StatusCodes.OK).json(result);
                }
            }
        } else {
            const result = await productsService.getAllProducts();

            if (result.length > 0) {
                res.status(StatusCodes.OK).json(result);
            }
        }

        res.status(StatusCodes.NOT_FOUND);
    } catch(e) {
        res.status(StatusCodes.BAD_REQUEST);
    }
} 

async function postProductsMethod(req: NextApiRequest, res: NextApiResponse) {
    try {
        const result = await productsService.upsertProduct(req.body);

        res.status(StatusCodes.OK).json(result);
    } catch(e) {
        res.status(StatusCodes.BAD_REQUEST);
    }
}

async function deleteProductsMethod(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.query.id !== undefined) {

            const productId = parseInt(req.query.id as string, 10);//Primer el passe a número perque el id és un número 

            if(!isNaN(productId)){
                const result = await productsService.deleteProduct({
                    id: productId
                });

                res.status(StatusCodes.OK);
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
            await getProductsMethod(req, res);
            break;
        case 'POST':
            await withAdminGuard(req, res, postProductsMethod);
            break;
        case 'DELETE':
            await withAdminGuard(req, res, deleteProductsMethod);
            break;
        default:
            res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
                type: "error",
                message: ReasonPhrases.METHOD_NOT_ALLOWED
            });
    }
}

export default (req: NextApiRequest, res: NextApiResponse) => withAuthGuard(req, res, requestHandler);