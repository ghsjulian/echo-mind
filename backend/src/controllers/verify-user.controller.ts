import { Request, Response } from "express";
import config from "../config/app.config.js";
import { User } from "../models/user.model.js";
import { parseCookie } from "cookie";




const verifyUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const cookies = parseCookie(req?.headers?.cookie as string || "");
        let cookie = cookies?.echomind_user || null
        let currentUser = (req as Request & { user?: User | undefined }).user

        if (!currentUser?.user_id) {
            res.status(404).json({
                success: false,
                message: "User ID Not Found",
                timestamp: new Date().toISOString()
            });
            return;
        }

        res.cookie("echomind_user", cookie, {
            // httpOnly: true,
            // secure: config.NODE_ENV === "production",
            // sameSite: "none",
            // maxAge: 360 * 24 * 60 * 60 * 1000,
            // path: "/",
            httpOnly: true,
            secure: true,       // Required for SameSite=None
            sameSite: "none",   // Must be 'none' since frontend and backend subdomains differ
            path: "/",
            maxAge: 31104000000 // 1 year (matches your Max-Age=31104000)
        });
        res.status(200).json({
            success: true,
            user: currentUser,
            message: "User Verfied Successfully",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.log(error)
        res.status(200).json({
            success: false,
            message: "User Verfied Failed",
            timestamp: new Date().toISOString()
        });
    }
}

export default verifyUser