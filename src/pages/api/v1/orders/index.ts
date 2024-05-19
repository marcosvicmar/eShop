import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { OrdersService, withAuthGuard } from "@/backend";
import { container } from "tsyringe";

const ordersService = container.resolve(OrdersService);

async function getOrderMethod(req: NextApiRequest, res: NextApiResponse) {
    if (req.query.id !== undefined) {
        const orderId = parseInt(req.query.id as string, 10);

        if(!isNaN(orderId)){
            const result = await ordersService.getOrderById({
                id: orderId,
            })

            if (result !== null)  {
                res.status(StatusCodes.OK).json(result);

                return;
            }
        }
    } else if (req.query.totalPrice === 'true' && req.query.orderId !== undefined) {
        const orderId = parseInt(req.query.orderId as string, 10);

        if(orderId !== undefined && !isNaN(orderId)){
            const result = await ordersService.getTotalFromOrders({
                id: orderId,
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
    } else {
        const result = await ordersService.getAllOrders();

        if (result.length > 0) {
            res.status(StatusCodes.OK).json(result);
        
            return;
        }
    }

    res.status(StatusCodes.NOT_FOUND).json({ error: 'Order not found.' });
} 

async function postOrderMethod(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.query.cartId !== undefined) {
            const cartId = parseInt(req.query.cartId as string, 10);

            if(!isNaN(cartId)){
                const result = await ordersService.convertCartToOrder(cartId, req.body);
                res.status(StatusCodes.OK).json(result);

                return;
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid cart ID.' });

                return;
            }
        } else {
            const result = await ordersService.upsertOrder(req.body);
            res.status(StatusCodes.OK).json(result);

            return;
        }
    } catch(e) {
        res.status(StatusCodes.BAD_GATEWAY).json({ error: e.message });
    }
}

async function deleteOrderMethod(req: NextApiRequest, res: NextApiResponse) {
    if (req.query.id !== undefined) {
        const orderId = parseInt(req.query.id as string, 10);

        if(!isNaN(orderId)){
            try {
                await ordersService.deleteOrder({ id: orderId });
                res.status(StatusCodes.OK).json({ message: 'Order deleted successfully.' });
            } catch(e) {
                res.status(StatusCodes.BAD_REQUEST).json({ error: e.message });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid order ID.' });
        }
    } else {
        res.status(StatusCodes.BAD_REQUEST).json({ error: 'Order ID is required.' });
    }
}


const requestHandler = async (req: NextApiRequest, res: NextApiResponse) => {    
    switch (req.method) {
        case 'GET':
            await getOrderMethod(req, res);
            break;
        case 'POST':
            await postOrderMethod(req, res);
            break;
        case 'DELETE':
            await deleteOrderMethod(req, res);
            break;
        default:
            res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
                type: "error",
                message: ReasonPhrases.METHOD_NOT_ALLOWED
            });
    }
}

export default (req: NextApiRequest, res: NextApiResponse) => withAuthGuard(req, res, requestHandler);