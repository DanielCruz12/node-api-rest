/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import { NextFunction } from 'express'

export const authenticateToken = async (req: any, res: any, next: NextFunction) => {
    const JWT_SECRET = process.env.JWT_SECRET || 'public'
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return req.status(401).json({ error: "No autorizado" })
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        console.log(decoded)
        if (err) {
            console.error(err)
            return req.status(403).json({ error: "No autorizado" })
        }

        next()
    })
}