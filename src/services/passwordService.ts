import bcrypt from 'bcrypt';

const SALT_ROUNDS: number = 10;

export const hasPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};
