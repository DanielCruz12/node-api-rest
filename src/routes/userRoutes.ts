/* eslint-disable @typescript-eslint/no-explicit-any */

import express from 'express'
const router = express.Router()
import { authenticateToken } from '../middlewares/auth';
import { createUser, getAllUsers, getUserById, deleteUser, updateUser } from '../controllers/userController';

router.post('/', authenticateToken, createUser)
router.get('/', authenticateToken, getAllUsers)
router.get('/:id', authenticateToken, getUserById)
router.put('/:id', authenticateToken, updateUser)
router.delete('/:id', authenticateToken, deleteUser)

export default router
