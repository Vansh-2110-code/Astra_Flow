const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();
const localDist = 'd:\\lintcollab-web\\dist';
const remoteDist = '/var/www/astra-flow';

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const localFiles = getFiles(localDist);
console.log(`Found ${localFiles.length} files to upload.`);

conn.on('ready', () => {
  console.log('SSH Client ready for uploading dist.');
  conn.sftp((err, sftp) => {
    if (err) throw err;

    let index = 0;
    const uploadNext = () => {
      if (index === localFiles.length) {
        console.log('All frontend dist files uploaded successfully! Changing ownership to www-data...');
        // Change ownership to www-data so Nginx can read and serve them cleanly
        conn.exec('chown -R www-data:www-data /var/www/astra-flow', (chownErr, stream) => {
          if (chownErr) throw chownErr;
          stream.on('close', () => {
            console.log('Ownership changed successfully.');
            conn.end();
          });
        });
        return;
      }

      const localFile = localFiles[index];
      const relPath = path.relative(localDist, localFile).replace(/\\/g, '/');
      const remoteFile = path.posix.join(remoteDist, relPath);
      const remoteDir = path.posix.dirname(remoteFile);

      // Ensure remote directory exists
      sftp.mkdir(remoteDir, (mkdirErr) => {
        // Ignore folder already exists error
        console.log(`Uploading: ${localFile} -> ${remoteFile}`);
        sftp.fastPut(localFile, remoteFile, {}, (putErr) => {
          if (putErr) {
            console.error(`Error uploading ${localFile}:`, putErr);
            conn.end();
            return;
          }
          index++;
          uploadNext();
        });
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
