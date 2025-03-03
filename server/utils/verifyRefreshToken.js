import jwt from "jsonwebtoken";
import prisma from "../shared/prisma.js";

const verifyRefreshToken = async (req, res, next) => {
	const { refreshToken } = req.body;
	const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

	try {
		const users = await prisma.users.findMany({ where: { refresh_token: refreshToken } });
		if (users.length === 0) {
			return res.status(401).json({
				status: "Failed",
				error: "Invalid refresh token",
			});
		}

		jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
			if (err) {
				return res.status(403).json({
					status: "Failed",
					error: "Invalid refresh token",
				});
			}

			req.tokenDetails = tokenDetails;
			req.user = users[0];
			next();
		})
	} catch (err) {
		return res.status(500).json({
			status: "Failed",
			error: err,
		});
	}
}

export default verifyRefreshToken;