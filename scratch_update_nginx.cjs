const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connection established for Nginx update.');
  
  // Script to run on remote server:
  // 1. Back up current config file
  // 2. Use sed to replace the server_name config
  // 3. Print the configuration to verify it
  // 4. Test Nginx config
  // 5. Reload Nginx if testing passes
  const updateCmd = `
    echo "=== Backing up current Nginx config ===" && \
    cp /etc/nginx/sites-available/astraflow /etc/nginx/sites-available/astraflow.bak && \
    echo "=== Updating Nginx server_name ===" && \
    sed -i 's/server_name astraflow.sannainnovations.com;/server_name astraflow.sannainnovations.com astraflow.theastraai.com;/g' /etc/nginx/sites-available/astraflow && \
    echo "=== Verify Updated Config ===" && \
    grep -E "server_name" /etc/nginx/sites-available/astraflow && \
    echo "=== Testing Nginx config ===" && \
    nginx -t && \
    echo "=== Reloading Nginx ===" && \
    systemctl reload nginx && \
    echo "Nginx updated and reloaded successfully!"
  `;
  
  conn.exec(updateCmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Command completed with code: ' + code);
      conn.end();
    }).on('data', (data) => {
      console.log(data.toString());
    }).stderr.on('data', (data) => {
      console.error('STDERR: ' + data.toString());
    });
  });
}).on('error', (err) => {
  console.error('SSH Error:', err);
}).connect({
  host: '103.160.144.225',
  port: 22,
  username: 'root',
  password: "KB6Vn72p2gS`(\\F",
  readyTimeout: 20000
});
