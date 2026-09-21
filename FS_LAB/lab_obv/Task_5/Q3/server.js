const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Sample dataset of 5 students
const students = [
  { id: 1, name: "Alice Johnson", age: 20, major: "Computer Science" },
  { id: 2, name: "Bob Smith", age: 21, major: "Electrical Engineering" },
  { id: 3, name: "Charlie Brown", age: 22, major: "Mechanical Engineering" },
  { id: 4, name: "Diana Prince", age: 19, major: "Data Science" },
  { id: 5, name: "Evan Wright", age: 20, major: "Information Technology" }
];

// 1. Home Route (GET /)
app.get('/', (req, res) => {
  res.status(200).send(`
    <h1>Welcome to the Student API Server</h1>
    <p>Available endpoints:</p>
    <ul>
      <li><a href="/students">/students</a> - View list of students</li>
      <li><a href="/about">/about</a> - About this application</li>
    </ul>
  `);
});

// 2. Students Route (GET /students)
app.get('/students', (req, res) => {
  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

// 3. About Route (GET /about)
app.get('/about', (req, res) => {
  res.status(200).json({
    appName: "Student Management API Server",
    version: "1.0.0",
    description: "A lightweight Express.js server providing routes for student data and server information.",
    author: "Developer"
  });
});

// Handle undefined routes (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found"
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});