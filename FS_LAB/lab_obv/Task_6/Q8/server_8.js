const express = require('express');
const app = express();
const PORT = 3000;

// ==========================================
// 1. CUSTOM LOGGING MIDDLEWARE DEFINITION
// ==========================================
const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  const { method, url } = req;

  // Event listener triggered when the response has finished sending
  res.on('finish', () => {
    const elapsedTime = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    console.log(`[${timestamp}] ${method} ${url} - Status: ${statusCode} (${elapsedTime}ms)`);
  });

  // Pass control to the next middleware or route handler in the chain
  next();
};

// ==========================================
// 2. REGISTER MIDDLEWARE GLOBALLY
// ==========================================
// app.use() ensures this middleware runs for ALL incoming requests
app.use(loggerMiddleware);

// Optional built-in middleware for parsing JSON bodies
app.use(express.json());

// ==========================================
// 3. SAMPLE ROUTES
// ==========================================

// Home Route
app.get('/', (req, res) => {
  res.status(200).send('<h1>Express Server with Custom Logger</h1>');
});

// Users Route
app.get('/users', (req, res) => {
  res.status(200).json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]);
});

// POST Route to simulate payload processing
app.post('/data', (req, res) => {
  res.status(201).json({ message: 'Data created successfully', body: req.body });
});

// ==========================================
// 4. START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});