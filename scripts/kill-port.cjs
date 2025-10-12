const { execSync } = require('child_process');

const port = process.argv[2] || '3000';

function killPort(port) {
  try {
    if (process.platform === 'win32') {
      // Windows: Find and kill process on port
      try {
        const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
        const lines = output.split('\n');
        const pids = new Set();
        
        lines.forEach(line => {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && !isNaN(pid)) {
            pids.add(pid);
          }
        });
        
        pids.forEach(pid => {
          try {
            console.log(`Killing process ${pid} on port ${port}...`);
            execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
          } catch (e) {
            // Process might already be killed
          }
        });
        
        if (pids.size > 0) {
          console.log(`Port ${port} cleared successfully.`);
        }
      } catch (e) {
        // No process on port
        console.log(`Port ${port} is already free.`);
      }
    } else {
      // macOS/Linux: Use lsof to find and kill
      try {
        execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
        console.log(`Port ${port} cleared successfully.`);
      } catch (e) {
        console.log(`Port ${port} is already free.`);
      }
    }
  } catch (error) {
    console.log(`Could not clear port ${port}:`, error.message);
  }
}

killPort(port);