import { join, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { watchFile, unwatchFile } from 'fs';
import cfonts from 'cfonts';
import { createInterface } from 'readline';
import yargs from 'yargs';
import { promises as fsPromises } from 'fs';

const require = createRequire(import.meta.url);
const cluster = require('cluster');
const os = require('os');
const __dirname = dirname(fileURLToPath(import.meta.url));
const rl = createInterface(process.stdin, process.stdout);

const { say } = cfonts;

say('Ai Hoshino', {
  font: 'chrome',
  align: 'center',
  gradient: ['red', 'magenta'],
});

say(`Proximamente SenkoBot...`, {
  font: 'console',
  align: 'center',
  gradient: ['red', 'magenta'],
});

let isRunning = false;

async function start(files) {
  if (isRunning) return;
  isRunning = true;

  if (cluster.isMaster) {
    // Fork workers
    os.cpus().forEach(() => {
      const worker = cluster.fork();
      worker.on('message', (data) => {
        console.log('[RECEIVED]', data);
        switch (data) {
          case 'reset':
            worker.kill();
            isRunning = false;
            start(files);
            break;
          case 'uptime':
            worker.send(process.uptime());
            break;
        }
      });

      worker.on('exit', (code) => {
        isRunning = false;
        console.error('Unexpected error:', code);
        start(files);

        if (code !== 0) {
          watchFile(files[0], () => {
            unwatchFile(files[0]);
            start(files);
          });
        }
      });
    });
  } else {
    // Worker process executes the actual logic
    const args = [join(__dirname, files[0]), ...process.argv.slice(2)];

    say([process.argv[0], ...args].join(' '), {
      font: 'console',
      align: 'center',
      gradient: ['red', 'magenta'],
    });

    require(args[0]);

    let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
    if (!opts['test']) {
      if (!rl.listenerCount()) {
        rl.on('line', (line) => {
          process.send(line.trim());
        });
      }
    }
  }
}

start(['index.js']);
