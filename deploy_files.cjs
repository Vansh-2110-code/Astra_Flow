const { Client } = require('ssh2');
const path = require('path');

const conn = new Client();
const filesToUpload = [
  { local: 'd:\\lintcollab-web\\backend\\server.js', remote: '/root/Astra_Flow/backend/server.js' },
  { local: 'd:\\lintcollab-web\\backend\\.env.production', remote: '/root/Astra_Flow/backend/.env' },
  { local: 'd:\\lintcollab-web\\src\\components\\CreatePostModal.jsx', remote: '/root/Astra_Flow/src/components/CreatePostModal.jsx' },
  { local: 'd:\\lintcollab-web\\src\\components\\tabs\\ReelsTab.jsx', remote: '/root/Astra_Flow/src/components/tabs/ReelsTab.jsx' },
  { local: 'd:\\lintcollab-web\\src\\components\\PostCard.jsx', remote: '/root/Astra_Flow/src/components/PostCard.jsx' },
  { local: 'd:\\lintcollab-web\\src\\components\\post\\PostMedia.jsx', remote: '/root/Astra_Flow/src/components/post/PostMedia.jsx' },
  { local: 'd:\\lintcollab-web\\src\\components\\MusicLibraryModal.jsx', remote: '/root/Astra_Flow/src/components/MusicLibraryModal.jsx' },
  { local: 'd:\\lintcollab-web\\src\\components\\tabs\\StoryTab.jsx', remote: '/root/Astra_Flow/src/components/tabs/StoryTab.jsx' }
];

conn.on('ready', () => {
  console.log('SSH Client ready for file transfer.');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    
    let completed = 0;
    const uploadNext = () => {
      if (completed === filesToUpload.length) {
        console.log('All files uploaded successfully via SFTP. Running build and restarting docker backend...');
        
        // Command to run build on server and rebuild/restart the backend docker container
        // Wait, does the docker backend container copy server.js from /root/Astra_Flow/backend/server.js?
        // Let's check how the Docker container runs backend:
        // In the previous step we ran:
        // docker run -d --name astra-flow-backend -p 9000:8000 ... astra-flow-backend
        // Wait! The image name is 'astra-flow-backend'.
        // If we only updated '/root/Astra_Flow/backend/server.js' on the server's host filesystem,
        // does the container read from the host filesystem or is the server.js baked inside the image?
        // Ah! In the container runs, the binds only mounted db.json, uploads, and .env!
        // It did NOT mount server.js!
        // This means server.js is baked into the 'astra-flow-backend' image!
        // So we need to rebuild the docker image on the server:
        // 'cd /root/Astra_Flow/backend && docker build -t astra-flow-backend .'
        // And then stop, remove, and run the new container!
        // This is a CRITICAL observation!
        const buildCmd = `
          cd /root/Astra_Flow/backend && \\
          docker build -t astra-flow-backend . && \\
          docker stop astra-flow-backend && \\
          docker rm astra-flow-backend && \\
          docker run -d --name astra-flow-backend \\
            -p 9000:8000 \\
            -v /root/Astra_Flow/backend/db.json:/app/db.json \\
            -v /root/Astra_Flow/backend/uploads:/app/uploads \\
            -v /root/Astra_Flow/backend/.env:/app/.env \\
            --restart always \\
            astra-flow-backend && \\
          sleep 3 && \\
          docker ps | grep astra-flow-backend && \\
          docker logs --tail 20 astra-flow-backend
        `;
        
        conn.exec(buildCmd, (err, stream) => {
          if (err) throw err;
          stream.on('close', (code, signal) => {
            console.log('Command completed with code: ' + code);
            conn.end();
          }).on('data', (data) => {
            console.log('STDOUT:\n' + data);
          }).stderr.on('data', (data) => {
            console.log('STDERR:\n' + data);
          });
        });
        return;
      }
      
      const file = filesToUpload[completed];
      console.log(`Uploading: ${file.local} -> ${file.remote}`);
      sftp.fastPut(file.local, file.remote, {}, (uploadErr) => {
        if (uploadErr) {
          console.error(`Failed to upload ${file.local}:`, uploadErr);
          conn.end();
          return;
        }
        completed++;
        uploadNext();
      });
    };
    
    uploadNext();
  });
}).on('error', (err) => {
  console.error('Client Error:', err);
}).connect({
  host: '103.160.144.225',
  port: 22,
  username: 'root',
  password: "KB6Vn72p2gS`(\\F",
  readyTimeout: 30000
});
