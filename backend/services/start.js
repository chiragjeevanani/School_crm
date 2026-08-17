import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const reset = '\x1b[0m';

const services = [
  { name: 'gateway', color: '\x1b[36m', dir: 'api-gateway' },
  { name: 'auth', color: '\x1b[32m', dir: 'auth-service' },
  { name: 'platform', color: '\x1b[35m', dir: 'platform-service' },
];

const children = [];

function prefixLine(color, name, chunk, stream) {
  const text = chunk.toString();
  for (const line of text.split(/\r?\n/)) {
    if (line.length === 0) continue;
    stream.write(`${color}[${name}]${reset} ${line}\n`);
  }
}

function startService({ name, color, dir }) {
  const cwd = path.join(__dirname, dir);
  const modulesDir = path.join(cwd, 'node_modules');

  if (!fs.existsSync(modulesDir)) {
    console.error(`${color}[${name}]${reset} node_modules missing. Run: cd services/${dir} && npm install`);
    process.exit(1);
  }

  const child = spawn(process.execPath, ['--watch', 'src/server.js'], {
    cwd,
    windowsHide: true,
    stdio: ['inherit', 'pipe', 'pipe'],
    env: process.env,
  });

  child.stdout.on('data', (chunk) => prefixLine(color, name, chunk, process.stdout));
  child.stderr.on('data', (chunk) => prefixLine(color, name, chunk, process.stderr));
  child.on('exit', (code) => {
    console.log(`${color}[${name}]${reset} exited (${code ?? 'killed'})`);
  });

  children.push(child);
}

function stopAll() {
  for (const child of children) {
    if (!child.pid || child.killed) continue;
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore', shell: true });
    } else {
      child.kill('SIGTERM');
    }
  }
}

process.on('SIGINT', () => {
  stopAll();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopAll();
  process.exit(0);
});

console.log('Starting all backend services...\n');
for (const service of services) {
  startService(service);
}
console.log('Gateway http://localhost:5000  |  Auth :5001  |  Platform :5002');
console.log('Ctrl+C to stop all.\n');
