// OS Module
const os = require('os');

console.log(`OS Platform: ${os.platform()}`); // e.g., 'darwin', 'win32', 'linux'
console.log(`CPU Architecture: ${os.arch()}`); // e.g., 'x64'
console.log(`Total Memory: ${os.totalmem()} bytes`);
console.log(`Free Memory: ${os.freemem()} bytes`);
console.log('Current User Info:', os.userInfo());

// File Module
const fs = require('fs');

fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Failed to read file:', err.message);
        return;
    }
    console.log('File content:', data);
});

// DNS Module
const dns = require('dns');

dns.lookup('google.com', (err, address, family) => {
    if (err) {
        console.error('DNS lookup failed:', err.message);
        return;
    }
    console.log(`The Address : ${address}`);
    console.log(`The Family : IPv${family}`);
});