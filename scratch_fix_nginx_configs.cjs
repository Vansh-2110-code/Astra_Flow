const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connection established to fix Nginx configuration.');
  
  const astraflowConfig = `
# Server block for astraflow.sannainnovations.com
server {
    listen 80;
    server_name astraflow.sannainnovations.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name astraflow.sannainnovations.com;
    client_max_body_size 500M;

    root /var/www/astra-flow;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    ssl_certificate /etc/letsencrypt/live/astraflow.sannainnovations.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/astraflow.sannainnovations.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

# Server block for astraflow.theastraai.com
server {
    listen 80;
    server_name astraflow.theastraai.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name astraflow.theastraai.com;
    client_max_body_size 500M;

    root /var/www/astra-flow;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    ssl_certificate /etc/letsencrypt/live/astraflow.theastraai.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/astraflow.theastraai.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
`;

  const cleanSannawebConfig = `
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name server.sannainnovations.com;

    root /var/www/sanna-web;
    index index.html;

    # Redirect /login to the AstraFlow subdomain login page
    location = /login {
        return 301 https://astraflow.sannainnovations.com/login;
    }

    # Redirect any other /login/ to AstraFlow
    location = /login/ {
        return 301 https://astraflow.sannainnovations.com/login;
    }

    location / {
        try_files $uri $uri/ =404;
    }
}
`;

  // We write the new config strings to the remote server files
  const fixCmd = `
    echo "=== Writing clean astraflow config to /etc/nginx/sites-available/astraflow ===" && \
    cat << 'EOF' > /etc/nginx/sites-available/astraflow
${astraflowConfig.trim()}
EOF
    
    echo "=== Writing clean sannaweb config to /etc/nginx/sites-available/sannaweb ===" && \
    cat << 'EOF' > /etc/nginx/sites-available/sannaweb
${cleanSannawebConfig.trim()}
EOF

    echo "=== Restoring symlinks in sites-enabled ===" && \
    rm -f /etc/nginx/sites-enabled/astraflow && \
    ln -s /etc/nginx/sites-available/astraflow /etc/nginx/sites-enabled/astraflow && \
    
    echo "=== Testing Nginx configuration ===" && \
    nginx -t && \
    
    echo "=== Reloading Nginx ===" && \
    systemctl reload nginx && \
    echo "=== Nginx configuration successfully corrected and reloaded ==="
  `;
  
  conn.exec(fixCmd, (err, stream) => {
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
