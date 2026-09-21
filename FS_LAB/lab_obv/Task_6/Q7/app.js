// Import the installed external package 'lodash'
const _ = require('lodash');

// Sample Dataset
const numbers = [1, 2, 2, 3, 4, 4, 5, 6, 6, 7];
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 }
];

console.log('=== Demonstrating External Package (Lodash) ===\n');

// 1. Using Lodash to remove duplicate values from an array
const uniqueNumbers = _.uniq(numbers);
console.log('Original Array: ', numbers);
console.log('Unique Array:   ', uniqueNumbers);

// 2. Using Lodash to chunk an array into smaller sub-arrays
const chunked = _.chunk(uniqueNumbers, 3);
console.log('\nChunked Array (size 3):', chunked);

// 3. Using Lodash to group objects by a specific property
const groupedByAge = _.groupBy(users, 'age');
console.log('\nUsers Grouped by Age:');
console.log(groupedByAge);