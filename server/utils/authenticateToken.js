import jwt from "jsonwebtoken";
import prisma from "../shared/prisma.js";

const authenticateToken = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({
                status: "Failed",
                error: "No token provided. Please login",
            });
        }
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY);
        const currentUser = await prisma.users.findUnique({
            where: { user_id: decode.id },
        });

        if (!currentUser) {
            return res.status(401).json({
                status: "Failed",
                error: "User not found",
            });
        } else {
            const currentTime = Math.floor(Date.now() / 1000);
            if (decode.exp < currentTime) {
                return res.status(401).json({
                    status: "Failed",
                    error: "Token has expired",
                });
            }
        }

        req.user = currentUser;
        next();
    } catch (e) {
        let statusCode = 500 || e.statusCode;
        return res.status(statusCode).json({
            status: "Failed",
            error: e,
        });
    }
};

export default authenticateToken;
