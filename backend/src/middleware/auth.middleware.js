import jwt from 'jsonwebtoken'
import { httpError } from '../services/journal.service.js'

export const JWT_SECRET = process.env.JWT_SECRET || 'urban-furniture-secret-key-2026'

/**
 * Middleware: Verify JWT Bearer token or cookie.
 * Attaches decoded user { id, email, name, role, contactId } to req.user.
 */
export function authenticateToken(req, res, next) {
  let token = null

  const authHeader = req.headers['authorization']
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim()
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication token' })
  }
}

/**
 * Middleware: Enforce Role-Based Access Control (RBAC).
 * Returns HTTP 403 Forbidden if user role is not in allowedRoles.
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    // Normalize roles
    const userRole = req.user.role
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase())

    if (!userRole || !normalizedAllowed.includes(userRole.toLowerCase())) {
      return res.status(403).json({
        error: `Forbidden: Access restricted. Requires one of: [${allowedRoles.join(', ')}]. Current role: ${userRole || 'None'}`,
      })
    }

    next()
  }
}

/**
 * Middleware: Optional authentication.
 * Populates req.user if token is present and valid, but doesn't block unauthenticated requests.
 */
export function optionalAuth(req, res, next) {
  let token = null
  const authHeader = req.headers['authorization']
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim()
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token
  }

  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET)
    } catch (_err) {
      // ignore invalid token for optional auth
    }
  }
  next()
}
