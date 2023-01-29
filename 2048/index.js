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
const LEFT = [0, 1, 4]
const RIGHT = [12, 1, -4]
const DOWN = [3, 4, -1]
const UP = [0, 4, 1]
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
    next()
}
function generate() {
    const noState = []
    for (let i = 0; i < STATE.length; i++) {
        if (STATE[i].value === 0) {
            noState.push(i)
        }
    }
    if (noState.length === 0) return
    const curr = noState[random(0, noState.length - 1)]
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
function clear() {
    for (let i = 0; i < STATE.length; i++) {
        const { x, y } = STATE[i]
        console.log(i)
        ctx.clearRect(x, y, BLOCK_SIZE, BLOCK_SIZE)
        ctx.fillStyle = 'rgba(238, 228, 218, 0.35)'
        ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE)
    }
}
function next() {
    generate()
    render()
}
function mergeBoxValue(direction) {
    for (let i = direction[0]; i < direction[0] + direction[1] * 3 + 1; i += direction[1]) {
        // 获取每一列的值
        let stack = []
        for (let count = 0; count < 4; count++) {
            // console.log(i + count * direction[2])
            const current = parseInt(STATE[i + count * direction[2]].value)
            if (current !== 0) {
                stack.push(current)
            }
        }
        let combine = []
        while (stack.length) {
            const current = stack.shift()
            const length = combine.length
            if (length === 0) {
                combine.push(current)
                continue
            }
            if (combine[length - 1] === current) {
                combine[length - 1] += current
                if (stack.length > 0) {
                    combine.push(stack.shift())
                }
                continue
            }
            combine.push(current)
        }
        for (let count = 0; count < 4; count++) {
            if (combine[count]) {
                STATE[i + count * direction[2]].value = combine[count]
            } else {
                STATE[i + count * direction[2]].value = 0
            }
        }
    }

}

window.onload = initScene
window.addEventListener('keydown', (e) => {
    clear()
    const key = e.key
    switch (key) {
        case 'w':
            mergeBoxValue(UP)
            break;
        case 'a':
            mergeBoxValue(LEFT)
            break;
        case 's':
            mergeBoxValue(DOWN)
            break;
        case 'd':
            mergeBoxValue(RIGHT)
            break;
        default:
            break;
    }
    next()
})



