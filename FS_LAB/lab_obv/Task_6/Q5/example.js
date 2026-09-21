// 1. Define the Class Blueprint
class Car {
  // Constructor assigns instance-specific properties when 'new' is called
  constructor(brand, model, year) {
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.isEngineRunning = false; // Default property
  }

  // Common Method shared by all instances
  startEngine() {
    this.isEngineRunning = true;
    return `The ${this.year} ${this.brand} ${this.model}'s engine is now running.`;
  }

  // Common Method to display vehicle details
  getDetails() {
    return `${this.year} ${this.brand} ${this.model}`;
  }
}

// 2. Instantiate Multiple Objects from the Same Class
const car1 = new Car('Toyota', 'Camry', 2022);
const car2 = new Car('Tesla', 'Model 3', 2024);
const car3 = new Car('Ford', 'Mustang', 1969);

// 3. Demonstrate Independent State
console.log(car1.getDetails()); // Output: 2022 Toyota Camry
console.log(car2.getDetails()); // Output: 2024 Tesla Model 3
console.log(car3.getDetails()); // Output: 1969 Ford Mustang

// Starting engine for car1 only
console.log(car1.startEngine()); 
// Output: The 2022 Toyota Camry's engine is now running.

// Check engine states
console.log(car1.isEngineRunning); // true
console.log(car2.isEngineRunning); // false (remains independent)