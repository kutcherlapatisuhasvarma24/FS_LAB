const numbers = [10, 20, 35, 40, 50];
function getTotal(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}
function doubleNumbers(arr) {
  let doubled = [];
  for (let i = 0; i < arr.length; i++) {
    doubled.push(arr[i] * 2);
  }
  return doubled;
}
function evennumbers(arr){
    let evennum=[];
    for(let i=0;i<arr.length;i++){
        evennum.push(arr[i]%2==0);
    }
    return evennum;
}
function checkscores(arr){
    for(i=0;i<arr.length;i++){
        if(arr[i]>=35){
            console.log("pass");
        }
        else{
            console.log('fail');
        }
    }
    return checkscores;
}
console.log("Original numbers:", numbers);
console.log("Total sum:", getTotal(numbers));
console.log("Doubled numbers:", doubleNumbers(numbers));
console.log("Evennumbers:",evennumbers(numbers));
console.log(checkscores(numbers));
