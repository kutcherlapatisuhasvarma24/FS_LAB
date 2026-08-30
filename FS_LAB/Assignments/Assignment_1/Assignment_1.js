// 1. SINGLE INHERITANCE

class Person {
    walk() {
        console.log("Person can walk");
    }
}

class Student extends Person {
    study() {
        console.log("Student studies");
    }
}

console.log("1. Single Inheritance:");
let student1 = new Student();
student1.walk();
student1.study();


// 2. MULTILEVEL INHERITANCE

class LivingThing {
    breathe() {
        console.log("Living thing breathes");
    }
}

class Mammal extends LivingThing {
    giveBirth() {
        console.log("Mammal gives birth");
    }
}

class Human extends Mammal {
    speak() {
        console.log("Human can speak");
    }
}

console.log("\n2. Multilevel Inheritance:");
let human = new Human();
human.breathe();
human.giveBirth();
human.speak();


// 3. HIERARCHICAL INHERITANCE

class Shape {
    draw() {
        console.log("Shape can be drawn");
    }
}

class Circle extends Shape {
    area() {
        console.log("Circle has an area");
    }
}

class Rectangle extends Shape {
    perimeter() {
        console.log("Rectangle has a perimeter");
    }
}

console.log("\n3. Hierarchical Inheritance:");

let circle = new Circle();
circle.draw();
circle.area();

let rectangle = new Rectangle();
rectangle.draw();
rectangle.perimeter();


// 4. MULTIPLE INHERITANCE USING MIXINS

class Employee {
    work() {
        console.log("Employee is working");
    }
}

const Manager = {
    manage() {
        console.log("Employee is managing the team");
    }
};

const Developer = {
    code() {
        console.log("Employee is writing code");
    }
};

Object.assign(Employee.prototype, Manager, Developer);

console.log("\n4. Multiple Inheritance using Mixins:");

let employee = new Employee();
employee.work();
employee.manage();
employee.code();