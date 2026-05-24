// Wrapper to keep Next.js dev server alive in Replit sandbox
process.stdin.resume()

const { spawn } = require('child_process')

const server = spawn(
  './node_modules/.bin/next',
  ['dev', '-p', '5000'],
  {
    stdio: 'inherit',
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  }
)

server.on('exit', (code, signal) => {
  if (signal) {
    process.exit(0)
  }
  if (code !== 0) {
    process.exit(code)
  }
  // Restart on clean exit (Turbopack restart behavior)
  setTimeout(() => {
    process.exit(0)
  }, 100)
})

process.on('SIGINT', () => { server.kill('SIGINT'); process.exit(0) })
process.on('SIGTERM', () => { server.kill('SIGTERM'); process.exit(0) })
