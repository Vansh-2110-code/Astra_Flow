const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connection established for Certbot SSL installation.');
  
  // Script to run on remote server:
  // We'll run certbot non-interactively to obtain and configure SSL for astraflow.theastraai.com
  // Note: Certbot is already configured on this server, so we can use register-unsafely-without-email or just agree-tos.
  const certbotCmd = `
    echo "=== Running Certbot ===" && \
    certbot --nginx -d astraflow.theastraai.com --non-interactive --agree-tos --register-unsafely-without-email && \
    echo "=== Reloading Nginx ===" && \
    systemctl reload nginx && \
    echo "SSL Certificate installed and Nginx reloaded successfully!"
  `;
  
  conn.exec(certbotCmd, (err, stream) => {
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
