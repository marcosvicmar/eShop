import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { container } from "tsyringe";
import { AuthService, authDecode } from "..";

export const withAdminGuard = async (req: NextApiRequest, res: NextApiResponse, func: NextApiHandler) => {
    const authHeader = req.headers.authorization;
    const authService = container.resolve(AuthService);

    if (authHeader) {
        const [ email ] = authDecode(authHeader);
        
        if (await authService.validateAdmin(email)) {
            return await func(req, res);
        }
    }

    return res.status(StatusCodes.FORBIDDEN).json({
        type: "error",
        message: ReasonPhrases.FORBIDDEN,
    });
}
