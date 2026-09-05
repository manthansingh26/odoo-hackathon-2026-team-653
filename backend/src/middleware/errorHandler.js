// Shared Express error handler.
// Usage: at the end of app.js, `app.use(errorHandler)`.
// Centralizes the JSON error shape so the frontend can always expect
// { error: "message" } on failures.
export function errorHandler(err, req, res, next) {
  console.error(err)
  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Internal server error' })
}
