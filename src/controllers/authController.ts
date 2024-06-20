/* eslint-disable prettier/prettier */
import { Response, Request } from 'express';
import { hasPassword } from '../services/passwordService';
import prisma from '../models/user';
import { generateToken } from '../services/authService';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await hasPassword(password);
    const user = await prisma.create({
      data: { email, password: hashedPassword },
    });

    const token = generateToken(user)
    res.status(201).json({ token })
  } catch (error) {
    console.log(error);
  }
};
