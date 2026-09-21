// Import the core modules using require()
const os = require('os');
const path = require('path');
const fs = require('fs');

console.log('================================================');
console.log('            1. OS MODULE EXAMPLES               ');
console.log('================================================');

// Get OS platform and architecture
console.log(`OS Platform:     ${os.platform()}`);
console.log(`Architecture:    ${os.arch()}`);

// Memory stats (converted from bytes to Gigabytes)
const freeMemGB = (os.freemem() / (1024 ** 3)).toFixed(2);
const totalMemGB = (os.totalmem() / (1024 ** 3)).toFixed(2);
console.log(`Free Memory:     ${freeMemGB} GB / ${totalMemGB} GB`);

// CPU details and uptime
console.log(`CPU Cores:       ${os.cpus().length}`);
console.log(`System Uptime:   ${(os.uptime() / 3600).toFixed(2)} hours`);


console.log('\n================================================');
console.log('           2. PATH MODULE EXAMPLES              ');
console.log('================================================');

// Construct a cross-platform file path dynamically
const targetFilePath = path.join(__dirname, 'data', 'sample.txt');
console.log(`Joined File Path: ${targetFilePath}`);

// Extract path details
console.log(`Base Filename:    ${path.basename(targetFilePath)}`);
console.log(`Directory Name:   ${path.dirname(targetFilePath)}`);
console.log(`File Extension:   ${path.extname(targetFilePath)}`);


console.log('\n================================================');
console.log('            3. FS MODULE EXAMPLES               ');
console.log('================================================');

const outputFolder = path.join(__dirname, 'output_demo');
const demoFile = path.join(outputFolder, 'example.txt');

// A. Create directory synchronously if it doesn't exist
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
  console.log(`[DIR CREATED] Folder created at: ${outputFolder}`);
}

// B. Write to a file asynchronously
const initialData = 'Line 1: Hello from Node.js FS module!\n';
fs.writeFile(demoFile, initialData, 'utf8', (err) => {
  if (err) throw err;
  console.log('[WRITE] Successfully created and written to example.txt');

  // C. Append additional content
  const additionalData = 'Line 2: Appended content via fs.appendFile().\n';
  fs.appendFile(demoFile, additionalData, 'utf8', (err) => {
    if (err) throw err;
    console.log('[APPEND] Successfully appended new content.');

    // D. Read file content
    fs.readFile(demoFile, 'utf8', (err, data) => {
      if (err) throw err;
      console.log('\n--- Final File Contents ---');
      console.log(data.trim());
      console.log('---------------------------');
    });
  });
});