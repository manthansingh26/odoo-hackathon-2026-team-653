// Server entry point: imports the configured app and starts listening.
// App wiring lives in app.js so tests can import the app without
// binding a real port.
import app from './app.js'

const PORT = process.env.PORT || 4000

const server = app.listen(PORT, () => {
  console.log(`Urban Furniture Accounting API listening on http://localhost:${PORT}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[Server Startup Error] Port ${PORT} is already in use.`)
    console.error(`To inspect the conflicting process, run:`)
    console.error(`  lsof -nP -iTCP:${PORT} -sTCP:LISTEN`)
    console.error(`To free the port safely, stop that process before restarting.\n`)
  } else {
    console.error('\n[Server Startup Error]', err.message, '\n')
  }
  process.exit(1)
})

// Graceful shutdown
const shutdown = () => {
  server.close(() => {
    process.exit(0)
  })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
