/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, Request } from 'express';
import prisma from '../models/user';
import { hasPassword } from '../services/passwordService';


export const getAllUsers = async (res: Response): Promise<void> => {
    try {
        const users = await prisma.findMany()
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error' })
    }
}

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body
        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' })
            return
        }
        if (!password) {
            res.status(400).json({ message: 'El password es obligatorio' })
            return
        }
        const hashedPassword = await hasPassword(password)

        const user = await prisma.create({
            data: {
                email,
                password: hashedPassword
            }
        })
        res.status(201).json(user)
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            res.status(400).json({ message: 'El email ingresado ya existe' })
        }

        console.log(error)
        res.status(500).json({ error: 'Hubo un error en la creación del usuario' })
    }
}



export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    try {
        const user = await prisma.findUnique({ where: { id: userId } })
        if (!user) {
            res.status(404).json({ error: "el usuario no fue encontrado" })
            return
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    const { email, password } = req.body
    try {
        const dataToUpdate = {
            ...req.body
        }
        if (password) {
            const hashedPassword = await hasPassword(password);
            dataToUpdate.password = hashedPassword
        }
        if (email) {
            dataToUpdate.email = email
        }

        const user = await prisma.update({ where: { id: userId }, data: dataToUpdate })
        res.status(200).json(user)

    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            res.status(400).json({ message: 'El email ingresado ya existe' })
        }
        res.status(500).json({ error: 'Hubo un error' })
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    try {
        await prisma.delete({ where: { id: userId } })
        res.status(200).json({ message: "El usuario ha sido eliminado" })

    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(400).json({ message: 'Usuario no encontrado' })
        }
        res.status(500).json({ error: 'Hubo un error' })
    }
}