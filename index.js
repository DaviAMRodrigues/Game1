const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight



const collisionsMap = []
for (let i = 0; i < collisions.length; i+= 800) {
    collisionsMap.push(collisions.slice(i, 800 + i))
}

const boundaries = []
const offset = {
    x: 0,
    y: 0
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) =>{
        if (symbol === 158)
        boundaries.push(
            new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            })
        )
    })
})
console.log(collisionsMap)

const image = new Image()
image.src = './img/Project.png'

const foregroundImage = new Image()
foregroundImage.src = './img/Imagem1.jpg'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

const player = new Sprite({
    position: {
        x: canvas.width/2 - 192/4/2,
        y: canvas.height/2 - 68/2,
    },
    image: playerDownImage,
    frames: {
        max: 4
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})


const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}


const movables = [background, ...boundaries]

function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
        )
}

function animate(){
    foreground.draw();
    window.requestAnimationFrame(animate);
    background.draw();
    boundaries.forEach(Boundary => {
        Boundary.draw();
    });
    player.draw();

    let moving = true
        player.moving = false

    if(keys.w.pressed && lastKey === 'w') {
        player.moving = true

        for (let i = 0; i< boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }}
                })
                ) {
                console.log('collision')
                moving = false
                break
            }
        }

        if (moving)
        movables.forEach((movable) => {
            movable.position.y += 5
        })
    }
    else if (keys.a.pressed && lastKey === 'a') {
        player.moving = true
        player.image = player.sprites.left

        for (let i = 0; i< boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y 
                    }}
                })
                ) {
                console.log('collision')
                moving = false
                break
            }
        }

        if (moving)
        movables.forEach((movable) => {
            movable.position.x += 3
        })
    }

    else if(keys.d.pressed && lastKey === 'd') {
        player.moving = true
        player.image = player.sprites.right

        for (let i = 0; i< boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y 
                    }}
                })
                ) {
                console.log('collision')
                moving = false
                break
            }
        }

        if (moving)
        movables.forEach((movable) => {
            movable.position.x -= 3
        })
    }
}
animate()

let lastKey = ''
window.addEventListener('keydown', (e) =>{
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break

        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})

window.addEventListener('keyup', (e) =>{
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break

        case 'd':
            keys.d.pressed = false
            break
    }
})
