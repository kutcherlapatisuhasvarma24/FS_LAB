
let fruits = ["Apple", "Banana", "Orange", "Mango"];
fruits.push("Grape");
console.log("After push (End):", fruits);
fruits.unshift("Kiwi");
console.log("After unshift (Start):", fruits);
console.log("After splice insert at index 2:", fruits);
fruits[1] = "Green Apple";
console.log("After direct update at index 1:", fruits);
let itemToUpdate = "Orange";
let updateIndex = fruits.indexOf(itemToUpdate);
if (updateIndex !== -1) {
    fruits[updateIndex] = "Mandarin";
}
console.log("After updating 'Orange' to 'Mandarin':", fruits);

let removedLast = fruits.pop();
console.log(`After pop (Removed '${removedLast}'):`, fruits);

// Remove from the START (.shift)
let removedFirst = fruits.shift();
console.log(`After shift (Removed '${removedFirst}'):`, fruits);

fruits.splice(1, 1); // Removes 1 item starting at index 1
console.log("After deleting item at index 1:", fruits);