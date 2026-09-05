// App wiring: loads env vars, configures Express, mounts routes.
// Kept separate from server.js so tests can import the app without
// binding a real port.
import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import apiRoutes from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

// --- Global middleware ---

// Allow the Vite dev server to call this API from the browser.
// `credentials: true` is required so cookies can travel between frontend and backend.
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
  }),
)

// Parse incoming JSON request bodies into req.body.
app.use(express.json())

// Parse the Cookie header into req.cookies (needed for JWT cookie in M2).
app.use(cookieParser())

// --- Health check (public, no auth) ---
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Urban Furniture Accounting API is running',
  })
})

// --- Versioned business routes ---
app.use('/api', apiRoutes)

// --- Shared error handler ---
app.use(errorHandler)

export default app
