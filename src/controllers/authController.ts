import { Response, Request } from 'express';
import { hasPassword } from '../services/passwordService';
import prisma from '../models/user';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await hasPassword(password);
    console.log(hashedPassword);
    const user = await prisma.create({
      data: { email, password: hashedPassword },
    });
  } catch (error) {
    console.log(error);
  }
};
