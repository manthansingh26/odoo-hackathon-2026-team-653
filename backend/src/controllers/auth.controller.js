import * as authService from '../services/auth.service.js'

export async function login(req, res, next) {
  try {
    const result = await authService.loginUser(req.body)
    
    // Set HTTP-only cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json(result)
  } catch (err) {
    next(err)
  }
}

export function me(req, res) {
  res.json({ user: req.user })
}

export function logout(req, res) {
  res.clearCookie('token')
  res.json({ message: 'Logged out successfully' })
}
