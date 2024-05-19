import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { CartsService, UsersService, withAuthGuard } from "@/backend";
import { container } from "tsyringe";

const cartsService = container.resolve(CartsService);
const usersService = container.resolve(UsersService);

async function getCartMethod(req: NextApiRequest, res: NextApiResponse) {
    if (req.query.id !== undefined) {
        const cartId = parseInt(req.query.id as string, 10);

        if(cartId !== undefined && !isNaN(cartId)){
            const result = await cartsService.getCartById({
                id: cartId,
            })

            if (result !== null)  {
                res.status(StatusCodes.OK).json(result);

                return;
            }
        }
    } else if (req.query.userEmail !== undefined) {
        const result = await usersService.getUserByEmail({
            email: req.query.userEmail as string,
        })

        if (result !== null)  {
            const cart = await cartsService.getCartsByUserId({
                userId: result.id,
            })

            if (cart !== null) {
                res.status(StatusCodes.OK).json(cart);
        
                return;
            }
        }
    } else if (req.query.totalPrice === 'true' && req.query.cartId !== undefined) {
        const cartId = parseInt(req.query.cartId as string, 10);

        if(cartId !== undefined && !isNaN(cartId)){
            const result = await cartsService.getTotalFromCart({
                id: cartId,
            });

            if (result !== null && result.length > 0)  {
                const parseResult = JSON.parse(JSON.stringify(
                    result[0],
                    (key, value) => (typeof value === "bigint" ? parseInt(value.toString()) : value)
                ));

                res.status(StatusCodes.OK).json(parseResult);

                return;
            }
        }
    }

    res.status(StatusCodes.NOT_FOUND).json({ error: 'Cart not found.' });
} 

async function postCartMethod(req: NextApiRequest, res: NextApiResponse) {
    try {
        const result = await cartsService.upsertCart(req.body);
        res.status(StatusCodes.OK).json(result);
    } catch(e) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: e.message });
    }
}

async function addItemsToCardMethod(req: NextApiRequest, res: NextApiResponse) {
    try {
        await cartsService.addProductToCart(req.body);
        res.status(StatusCodes.OK).json({ message: 'Product added successfully.' });
    } catch(e) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: e.message });
    }
}

async function deleteCartMethod(req: NextApiRequest, res: NextApiResponse) {
    if (req.query.id !== undefined) {
        const cartId = parseInt(req.query.id as string, 10);

        if(!isNaN(cartId)){
            try {
                await cartsService.deleteCart({ id: cartId });
                res.status(StatusCodes.OK).json({ message: 'Cart deleted successfully.' });
            } catch(e) {
                res.status(StatusCodes.BAD_REQUEST).json({ error: e.message });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid cart ID.' });
        }
    } else if (req.query.cartId !== undefined && req.query.productId !== undefined) {
        const cartId = parseInt(req.query.cartId as string, 10);
        const productId = parseInt(req.query.productId as string, 10);

        if(!isNaN(cartId) && !isNaN(productId)){
            try {
                await cartsService.deleteProductFromCart({ id: cartId }, { id: productId });
                res.status(StatusCodes.OK).json({ message: 'Product deleted successfully.' });
            } catch(e) {
                res.status(StatusCodes.BAD_REQUEST).json({ error: e.message });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid cart ID or product ID.' });
        }
    } else {
        res.status(StatusCodes.BAD_REQUEST).json({ error: 'Cart ID is required.' });
    }
}

const requestHandler =  async (req: NextApiRequest, res: NextApiResponse) => {    
    switch (req.method) {
        case 'GET':
            await getCartMethod(req, res);
            break;
        case 'POST':
            await postCartMethod(req, res);
            break;
        case 'PUT':
            await addItemsToCardMethod(req, res);
            break;
        case 'DELETE':
            await deleteCartMethod(req, res);
            break;
        default:
            res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
                type: "error",
                message: ReasonPhrases.METHOD_NOT_ALLOWED
            });
    }
}

export default (req: NextApiRequest, res: NextApiResponse) => withAuthGuard(req, res, requestHandler);
