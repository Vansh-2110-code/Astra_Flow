const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connection established. Fetching Nginx configuration...');
  // We'll read the configurations in sites-enabled and running nginx config
  const checkCmd = `
    echo "=== Nginx sites-enabled files ===" && \
    ls -la /etc/nginx/sites-enabled/ && \
    echo "=== Configuration contents ===" && \
    tail -n +1 /etc/nginx/sites-enabled/*
  `;
  
  conn.exec(checkCmd, (err, stream) => {
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
