const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  const buildBackendCmd = `
    cd /root/Astra_Flow/backend && \
    docker build -t astra-flow-backend . && \
    docker stop astra-flow-backend && \
    docker rm astra-flow-backend && \
    docker run -d --name astra-flow-backend \
      -p 9000:8000 \
      -v /root/Astra_Flow/backend/db.json:/app/db.json \
      -v /root/Astra_Flow/backend/uploads:/app/uploads \
      -v /root/Astra_Flow/backend/.env:/app/.env \
      --restart always \
      astra-flow-backend && \
    sleep 3 && \
    docker ps | grep astra-flow-backend && \
    docker logs --tail 20 astra-flow-backend
  `;
  
  conn.exec(buildBackendCmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Backend Build & Restart completed with code: ' + code);
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT:\n' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR:\n' + data);
    });
  });
}).on('error', (err) => {
  console.error('Client :: error :: ' + err);
}).connect({
  host: '103.160.144.225',
  port: 22,
  username: 'root',
  password: "KB6Vn72p2gS`(\\F",
  readyTimeout: 20000
});
