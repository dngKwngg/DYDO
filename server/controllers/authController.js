import prisma from "../shared/prisma.js";

import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";
import generateToken from "../utils/generateToken.js";
import authenticateToken from "../utils/authenticateToken.js";
// http://localhost:8080/auth/login
// "email" : "staffbadinh3@gmail.com",
//     "password" : "123456"
const login = async (req, res) => {
    try {
        const user = await prisma.users.findMany({
            where: { email: req.body.email },
        });

        if (user.length === 0) {
            return res.status(400).json({
                status: "Failed",
                error: "User not found",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user[0].password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                status: "Failed",
                error: "Invalid password",
            });
        }

        const { accessToken, refreshToken } = await generateToken(user[0], res);

        return res.status(200).json({
            status: "Success",
            data: {
                user: {
                    id: user[0].user_id,
                    email: user[0].email,
                    role: user[0].role,
					centre_id: user[0].centre_id,
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            error: err.message,
        });
    }
};


const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await prisma.users.findMany({
            where: { email },
        });

        if (user.length === 0) {
            return res.status(404).json({
                status: "Failed",
                error: "User not found",
            });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        await prisma.users.update({
            where: { email },
            data: { otp, otp_expires: otpExpires },
        });

        // Configure Nodemailer to send email
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        });

        // Email message
        const mailOptions = {
            from: "no-reply@mailtrap.io",
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`,
        };

        // Send email
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return res.status(500).json({
                    status: "Failed",
                    error: "Failed to send email",
                });
            }

            // OTP email sent successfully
            return res.status(200).json({
                status: "Success",
                message: "OTP sent to email successfully",
            });
        });
    } catch (err) {
        return res.status(500).json({ status: "Failed", error: err });
    }
};

const verifyOtpAndResetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await prisma.users.findMany({
            where: { email },
        });

        if (user.length === 0 || user.otp !== otp) {
            return res.status(404).json({
                status: "Failed",
                error: "User not found or invalid OTP",
            });
        }

        if (Date.now() > user[0].otp_expires) {
            return res.status(400).json({
                status: "Failed",
                error: "OTP has expired",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.users.update({
            where: { email },
            data: { password: hashedPassword, otp: null, otp_expires: null },
        });

        return res.status(200).json({
            status: "Success",
            message: "Password reset successfully",
        });
    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            error: err,
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const oldRefreshToken = req.body.refreshToken;

        if (!oldRefreshToken) {
            return res.status(400).json({
                status: "Failed",
                error: "Refresh token is required",
            });
        }

        // Generate new tokens, passing the old refresh token
        const { accessToken, refreshToken } = await generateToken(
            req.user,
            res,
            oldRefreshToken
        );

        return res.status(200).json({
            status: "Success",
            data: {
                accessToken,
                refreshToken,
            },
        });
    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            error: err.message,
        });
    }
};


export default {
    login,
    authenticateToken,
    forgotPassword,
    verifyOtpAndResetPassword,
	refreshToken,
};
