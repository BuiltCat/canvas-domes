const COLOR_MAP = {
    2: {
        fillStyle: '#eee4da',
        fontStyle: '#776e65'
    },
    4: {
        fillStyle: '#eee1c9',
        fontStyle: '#776e65'
    },
    8: {
        fillStyle: '#f3b27a',
        fontStyle: '#f9f6f2'
    },
    16: {
        fillStyle: '#f69664',
        fontStyle: '#f9f6f2'
    },
    32: {
        fillStyle: '#f77c5f',
        fontStyle: '#f9f6f2'
    },
    64: {
        fillStyle: '#f75f3b',
        fontStyle: '#f9f6f2'
    },
    128: {
        fillStyle: '#edd073',
        fontStyle: '#f9f6f2'
    },
    256: {
        fillStyle: '#edcc62',
        fontStyle: '#f9f6f2'
    },
    512: {
        fillStyle: '#edc950',
        fontStyle: '#f9f6f2'
    },
    1024: {
        fillStyle: '#edc53f',
        fontStyle: '#f9f6f2'
    },
    2048: {
        fillStyle: '#edc22e',
        fontStyle: '#f9f6f2'
    },
}
const STATE = []
let CURRENT_NUMBER = 0
const BLOCK_SIZE = 72.5
const SPACE_SIZE = 20
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

function random(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function initScene() {
    let initX = 20
    let initY = 220
    ctx.font = `48px serif`;
    ctx.fillStyle = '#bbada0';
    ctx.fillRect(0, 200, 590, 390)
    ctx.fillStyle = 'rgba(238, 228, 218, 0.35)'
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let x = initX + i * (BLOCK_SIZE + SPACE_SIZE);
            let y = initY + j * (BLOCK_SIZE + SPACE_SIZE);
            ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE)
            STATE.push({
                x,
                y,
                value: 0
            })
        }
    }
}
function generate() {
    const noState = []
    for (let i = 0; i < STATE.length; i++) {
        if (STATE[i].value === 0) {
            noState.push(i)
        }
    }
    console.log(noState)
    if (noState.length === 0) return
    const curr = noState[random(0, noState.length)]
    STATE[curr].value = Math.random() > 0.5 ? 2 : 4
}
function render() {
    for (let i = 0; i < STATE.length; i++) {
        const { x, y, value } = STATE[i]
        if (!value) continue
        ctx.fillStyle = COLOR_MAP[value].fillStyle;
        ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE)
        ctx.fillStyle = COLOR_MAP[value].fontStyle;
        const text = ctx.measureText(value)
        ctx.fillText(value, x + BLOCK_SIZE / 2 - text.width / 2, y + BLOCK_SIZE / 2 + 15)
    }
}
function next() {
    generate()
    render()
}

window.onload = initScene
window.addEventListener('keydown', (e) => {
    const key = e.key
    switch (key) {
        case 'w':
            next()
            break;
        case 'a':
            next()
            break;
        case 's':
            next()
            break;
        case 'd':
            next()
            break;
        default:
            break;
    }

})



