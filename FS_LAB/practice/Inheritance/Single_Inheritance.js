class vehicle {
    constructor(brand, speed) {
        this.brand = brand;
        this.speed = speed;
    }
    speedlimit(){
        console.log("speed limit is 80")
    }
}
class car extends vehicle {
    constructor(doors, brand, speed) {
        super(brand, speed);
        this.doors = doors;
    }
    horn() {
        console.log("beeepp")
    }
}
const mycar = new car(2, "Audi", 80);
mycar.horn();
mycar.speedlimit();