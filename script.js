const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 750;

platformList = []

let keys = {"ArrowLeft" : false,
            "ArrowRight" : false}

score = 0;


jumperWidth = 25;
jumperHeight = 25;
platformWidth = 75;
platformHeight = 15;
numPlatforms = 7;
gravity = 0.75;
specialPlatformChance = 0.1;

platformTypes = ["normal",
                 "singleUse",
                 "spring",
                 "trampoline"
                ]


class player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    updatePosition(){
        // if ((this.x >= 0 && this.velocityX < 0) || (this.x <= canvas.width - jumper.width && this.velocityX > 0)){
        //     this.x += this.velocityX;
        // }
        if (this.y >= canvas.height / 2 || this.velocityY >= 0){
            this.y += this.velocityY;
        }
    }

    jump(vel){
        this.velocityY = -vel;
    }

    decrementVelocityY(){
        this.velocityY += 1*gravity;
    }
}
    

class platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.collision = true;
        this.type = platformTypes[0];
        this.color = "black";
        this.boost = 1;
    }

    respawnPlatform(){
        this.y = -platformHeight;
        this.x = (Math.random() * canvas.width) - (platformWidth / 2);
        this.generateProperties();
    }

    generateProperties(){
        this.color = "black";
        this.collision = true;
        this.boost = 1;
        if (Math.random() >= 1 - specialPlatformChance){
            console.log("special");
            this.type = platformTypes[1 + Math.floor(Math.random() * (platformTypes.length - 1))];
            console.log(this.type);
        }
        else{
            this.type = platformTypes[0];
        }
        switch (this.type){
            case "singleUse":
                this.color = "red";
                this.boost;
                break;
            case "spring":
                this.color = "rgba(0, 50, 0, 1)";
                this.boost = 1.5;
                break;
            case "trampoline":
                this.color = "lightgreen";
                this.boost = 2.5;
                this.break;
        }
    }
    
    break(){
        this.collision = false;
        this.color = "rgba(0, 0, 0, 0.2)";
    }
}





function initializeGame(){
    jumper = new player(100, canvas.height - jumperHeight - 50, jumperWidth, jumperHeight);
    ctx.fillRect(jumper.x, jumper.y, jumper.width, jumper.height);
    jumper.jump(20);
    for (let i = 0; i < numPlatforms; i++){
        platformList.push(
            new platform(Math.random() * canvas.width - platformWidth / 2, 
            (canvas.height / numPlatforms) * i + (Math.random() - 0.5) * 20, 
            platformWidth,
            platformHeight)
        )
    }
    
    ctx.font = "16px serif";
    ctx.fillText(score.toString(), 30, 30);
}

function updateObjects(){
    if (!keys["ArrowLeft"] || !keys["ArrowRight"]){
        if (keys["ArrowLeft"] && jumper.x >= 0){
            jumper.x -= 10
        }
        else if (keys["ArrowRight"] && jumper.x <= canvas.width - jumper.width){
            jumper.x += 10
        }
    }

    checkJumperPosition();
    
    if (jumper.y >= canvas.height / 2 || jumper.velocityY >= 0){
        jumper.y += jumper.velocityY;
    }

    else{
        scrollScreen();
    }

    if (jumper.y >= canvas.height + jumperHeight){
        alert("GG");
    }


    // jumper.updatePosition();
    jumper.decrementVelocityY();
}

function checkJumperPosition(){
    for (const i of platformList){
        if (jumper.velocityY >= 0 &&
            jumper.y + jumper.height >= i.y && 
            jumper.y <= i.y + platformHeight &&
            jumper.x + jumperWidth >= i.x &&
            jumper.x <= i.x + platformWidth &&
            i.collision == true){
                jumper.jump(20 * i.boost);
                if (i.type == "singleUse"){
                    i.break();
                }
            }
    }
}

function scrollScreen(){
    for (const i of platformList){
        i.y -= jumper.velocityY;
        if (i.y >= canvas.height){
            i.respawnPlatform();
        }
    }

    score -= Math.floor(jumper.velocityY / 10);
}


// function updateJumperVelocityX(){
//     if (Math.abs(jumper.velocityX) < 5){
//         if (keys["ArrowLeft"]){
//             jumper.velocityX -= 0.2;
//         }
//         else if (keys["ArrowRight"]){
//             jumper.velocityX += 0.2;
//         }
//     }

//     if (!keys["ArrowLeft"] && !keys["ArrowRight"]){
//         if (Math.abs(jumper.velocityX) <= 0.2){
//             jumper.velocityX = 0;
//         }
//         if (jumper.velocityX > 0){
//             jumper.velocityX -= 0.2;
//         }
//         else if (jumper.velocityX < 0){
//             jumper.velocityX += 0.2;
//         }
//     }
// }

function updateDisplay(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillRect(jumper.x, jumper.y, jumper.width, jumper.height);

    for (const i of platformList){
        ctx.fillStyle = i.color;
        ctx.fillRect(i.x, i.y, i.width, i.height);
    }

    ctx.fillStyle = "black";

    ctx.fillText(score.toString(), 30, 30);
}

function gameLoop(){
    // console.log(jumper.velocityX)
    updateObjects();
    updateDisplay();

    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function(event){
    const key = event.key;
    // console.log(key);
    switch (key) {
        case "ArrowLeft": 
            keys[key] = true;
            break; 
        case "ArrowRight": 
            keys[key] = true;
            break; 
    } 
})

document.addEventListener("keyup", function(event){
    const key = event.key;
    switch (key) {
        case "ArrowLeft": 
            keys[key] = false;
            break; 
        case "ArrowRight": 
            keys[key] = false;
            break; 
    } 
})


initializeGame();
gameLoop();
// while (true){
//     gameLoop();
// }    