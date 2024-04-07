const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("start_screen");
const deathScreen = document.getElementById("death_screen");

const start_game_button = document.getElementById("start_game");
const start_game_button_2 = document.getElementById("start_game_2");

let points_value = 0;
const Points = document.getElementById("points")
Points.textContent = points_value;

function UpdatePoints(){
    Points.textContent = points_value
}

let running = false;
let spawn_walls;
let spawn_powerups;
let shooting = false;

let Wall_speed = 3;
let Wall_Spawn_interval = 1500;

let amount_of_bullets = 0;

let possible_y = []

let jump_sound = new Audio();
jump_sound.src = "./jump.wav";

start_game_button.addEventListener("click", () => {
    running = true;
    startScreen.style.display = "none";
    deathScreen.style.display = "none";
    update();
});

start_game_button_2.addEventListener("click", () => {
    running = true;
    deathScreen.style.display = "none";
    update();
    SetSpawnWalls();
    SetSpawnPowerups()
});

class Bullet {
    constructor(x, y, width, height) {
        this.position = { x: x, y: y };
        this.width = width;
        this.height = height;
        this.speed = 5;
        this.exists = true;
    }

    draw() {
        if (this.exists) {
            ctx.fillStyle = "red";
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    remove() {
        let index = bullets.indexOf(this);
        bullets.splice(index, 1);
        this.exists = false;
    }

    update() {
        this.draw();
        this.position.x += this.speed;
        for (let wall of walls) {
            if (
                wall.position.x < this.position.x + this.width &&
                wall.position.x + wall.width > this.position.x &&
                wall.position.y < this.position.y + this.height &&
                wall.position.y + wall.height > this.position.y
            ) {
                wall.remove();
                this.remove();
            }
        }
        if (this.position.x + this.width >= canvas.width) {
            this.remove();
        }
    }
}
class Bird {
    constructor(x, y, width, height) {
        this.position = { x: x, y: y };
        this.velocity = { x: 0, y: 0 };
        this.width = width;
        this.height = height;
        this.gravity = 0.6;
        this.speed = 3;
        this.jumpStrength = -10;
        this.powerups = { gun: false };
    }

    jump() {
        this.velocity.y = this.jumpStrength;
    }

    shoot() {
        if (this.powerups.gun && amount_of_bullets > 0) {
            let newBullet = new Bullet(this.position.x + this.width, this.position.y + this.height / 2, 10, 5);
            bullets.push(newBullet);
            amount_of_bullets -= 1;
        }
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y;
        this.velocity.y += this.gravity;
        if (this.position.y + this.height >= canvas.height) {
            this.position.y = canvas.height - this.height;
        }
    }
}
class Wall {
    constructor(x, y, width, height, color) {
        this.position = { x: x, y: y };
        this.color = color;
        this.width = width;
        this.height = height;
        this.speed = Wall_speed;
        this.exists = true;
    }

    draw() {
        if (this.exists) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    remove() {
        let index = walls.indexOf(this);
        walls.splice(index, 1);
        this.exists = false;
    }

    update() {
        this.draw();
        this.position.x -= this.speed;
        if (
            player.position.x < this.position.x + this.width &&
            player.position.x + player.width > this.position.x &&
            player.position.y < this.position.y + this.height &&
            player.position.y + player.height > this.position.y
        ) {
            setTimeout(() => {
                Reset();
                running = false;
                deathScreen.style.display = "block";
            }, 100);
        }

        if(this.position.x + this.width + 10 <= 0){
            this.remove()
            points_value++
            UpdatePoints()
            Wall_speed += .1
            Wall_Spawn_interval -= 1
        }
    }
}
class Powerup {
    constructor(x, y) {
        this.position = { x: x, y: y };
        this.effects = ["gun"]; // FLER
        this.effect_index = Math.floor(Math.random() * this.effects.length);
        this.Powerup = this.effects[this.effect_index];
        this.width = 25;
        this.height = 25;
        this.speed = 2;
        this.exists = true;
    }

    draw() {
        if (this.exists) {
            ctx.fillStyle = "yellow";
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    destroy() {
        let index = powerups.indexOf(this);
        powerups.splice(index, 1);
        this.exists = false;
    }

    update() {
        if (this.exists) {
            this.draw();
            this.position.x -= this.speed;
            if (
                player.position.x < this.position.x + this.width &&
                player.position.x + player.width > this.position.x &&
                player.position.y < this.position.y + this.height &&
                player.position.y + player.height > this.position.y
            ) {
                this.destroy();
                if (this.Powerup == "gun") {
                    player.powerups.gun = true
                    amount_of_bullets += 5; 
                }
            }
        }
    }
}


let walls = [];
let powerups = [];
let bullets = [];

function SetSpawnWalls() {
    spawn_walls = setInterval(() => {
        let top_bottom = Math.floor(Math.random() * 2);
        let y_cord = top_bottom === 0 ? 0 : canvas.height - 190;
        let wall = new Wall(canvas.width, y_cord, 50, 190, "green");
        if (y_cord === 1) {
            wall.height = -wall.height;
        }
        walls.push(wall);
    }, Wall_Spawn_interval);
}

function SetSpawnPowerups(){
    for(let i = canvas.height/2 - 100; i < canvas.height/2 + 100; i+=20){
        possible_y.push(i)
    }
    spawn_powerups = setInterval(() => {
        let x = Math.floor(Math.random() * canvas.width)
        let y = possible_y[Math.floor(Math.random() * possible_y.length)]

        powerups.push(new Powerup(x, y))
    }, 9000)
}

SetSpawnWalls();
SetSpawnPowerups()

let player = new Bird(10, canvas.height - 50, 20, 20);

function Reset() {
    for(let wall of walls) {
        wall.remove();
    }
    for(let powerup of powerups){
        powerup.destroy()
    }
    walls.splice(0, walls.length)
    powerups.splice(0, powerups.length)
    Wall_speed = 3;
    Wall_Spawn_interval = 1500;

    points_value = 0;
    walls.length = 0;
    clearInterval(spawn_walls);
    clearInterval(spawn_powerups)
    player.position.y = canvas.height / 2;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    for (let wall of walls) {
        wall.update();
    }
    for (let powerup of powerups) {
        powerup.update();
    }
    for (let bullet of bullets) {
        bullet.update();
    }
    if (running) {
        requestAnimationFrame(update);
    }
}
update();

addEventListener("keydown", (event) => {
    switch (event.key) {
        case "w":
            player.jump();
            jump_sound.play();
            break;
        case "k":
            console.log(possible_y)
            if (player.powerups.gun) {
                shooting = true;
                player.shoot();
            }
            break;
    }
});
