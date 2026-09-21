const fs = require('fs/promises');
const readline = require('readline');

// Create an interface for reading inputs from the terminal console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to turn rl.question into a Promise for async/await usage
const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function runFileManagement() {
  try {
    console.log('=== Node.js File System Manager ===\n');

    // 1. Prompt user for filename and content
    const filename = await askQuestion('Enter the filename to create (e.g., test.txt): ');
    const initialContent = await askQuestion('Enter initial content to write into the file: ');
    const extraContent = await askQuestion('Enter additional content to append: ');

    rl.close(); // Close the input interface

    console.log('\n--- Executing File System Operations ---\n');

    // 2. Create and Write to the File
    await fs.writeFile(filename, initialContent, 'utf8');
    console.log(`1. [SUCCESS] File "${filename}" created and initial content written.`);

    // 3. Read Initial File Contents
    const initialRead = await fs.readFile(filename, 'utf8');
    console.log(`2. [READ INITIAL] Contents of "${filename}":`);
    console.log(`   --> "${initialRead}"\n`);

    // 4. Append Additional Content to the File
    await fs.appendFile(filename, `\n${extraContent}`, 'utf8');
    console.log(`3. [SUCCESS] Additional content appended to "${filename}".`);

    // 5. Read and Display Final File Contents
    const finalRead = await fs.readFile(filename, 'utf8');
    console.log(`4. [READ FINAL] Updated contents of "${filename}":`);
    console.log('----------------------------------------');
    console.log(finalRead);
    console.log('----------------------------------------');

  } catch (error) {
    console.error('An error occurred during file operation:', error.message);
  }
}

// Execute the application
runFileManagement();