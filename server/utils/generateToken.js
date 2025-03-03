import jwt from "jsonwebtoken";
import prisma from "../shared/prisma.js";

const generateToken = async (user, res, oldRefreshToken = null) => {
    const payload = {
        id: user.user_id,
        role: user.role,
    };

    // Generate Access Token
    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_TIME,
        }
    );

    // Check if we are refreshing a refresh token
    let refreshToken = oldRefreshToken;

    if (oldRefreshToken) {
        // Decode the old refresh token to preserve the same expiration time
        const decoded = jwt.decode(oldRefreshToken);
        if (!decoded || !decoded.exp) {
            throw new Error("Invalid refresh token format");
        }

        // Calculate remaining expiration time
        const remainingTimeInSeconds =
            decoded.exp - Math.floor(Date.now() / 1000);

        // Create a new refresh token with the same expiration
        refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            {
                expiresIn: remainingTimeInSeconds, // Use the remaining expiration time
            }
        );
    } else {
        // Create a new refresh token with the default expiration
        refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRES_TIME,
            }
        );
    }

    // Save the new refresh token to the database
    await prisma.users.update({
        where: { user_id: user.user_id },
        data: {
            refresh_token: refreshToken,
            updatedAt: new Date(),
        },
    });

    return { accessToken, refreshToken };
};

export default generateToken;
