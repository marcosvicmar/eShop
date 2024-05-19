import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from "next"
import { container } from "tsyringe";
import { AuthService } from "../service";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { authDecode } from "../utils";

type NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export const withAuthGuard = async (req: NextApiRequest, res: NextApiResponse, func: NextApiHandler) => {
    const authHeader = req.headers.authorization;
    const authService = container.resolve(AuthService);

    if (authHeader) {
        const [email, password] = authDecode(authHeader);
        
        if (await authService.validateLogin(email, password)) {
            return await func(req, res);
        }
    }

    return res.status(StatusCodes.FORBIDDEN).json({
        type: "error",
        message: ReasonPhrases.FORBIDDEN,
    });
}
