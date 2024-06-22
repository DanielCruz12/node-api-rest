/* eslint-disable prettier/prettier */
import { Response, Request } from 'express';
import { hasPassword, comparePassword } from '../services/passwordService';
import prisma from '../models/user';
import { generateToken } from '../services/authService';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email) {
      res.status(400).json({ message: 'El email es obligatorio' })
      return
    }
    if (!password) {
      res.status(400).json({ message: 'El password es obligatorio' })
      return
    }
    const hashedPassword = await hasPassword(password);
    const user = await prisma.create({
      data: { email, password: hashedPassword },
    });

    const token = generateToken(user)
    res.status(201).json({ token })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      res.status(400).json({ message: 'El email ingresado ya existe' })
    }

    console.log(error)
    res.status(500).json({ error: 'Hubo un error en el registro' })
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  try {
    if (!email) {
      res.status(400).json({ message: 'El email es obligatorio' })
      return
    }
    if (!password) {
      res.status(400).json({ message: 'El password es obligatorio' })
      return
    }
    const user = await prisma.findUnique({ where: { email } })
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }
    if (!user.password) return
    const passwordMatch = comparePassword(password, user.password)
    if (!passwordMatch) {
      res.status(401).json({ error: 'Usuario y contraseñas no coinciden' })
    }

    const token = generateToken(user)
    res.status(200).json({ token })

  } catch (error) {
    console.log(error)
  }
}
