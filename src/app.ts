import dotenv from 'dotenv'
import express from 'express'
import authRoutes from './routes/authRoutes'
dotenv.config()

const app = express()
app.use(express.json())

//Routes
app.use('/auth', authRoutes)

//auth
//user
console.log('first')

export default app
