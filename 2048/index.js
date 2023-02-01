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

async function timer(func, count, space) {
    for (let i = 0; i <= count; i++) {
        func(i, count, space)
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve('execute')
            }, space)
        })
    }
}

function random(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

async function initScene() {
    let initX = 20
    let initY = 220
    ctx.font = `48px serif`;
    ctx.fillStyle = '#bbada0';
    ctx.fillRect(0, 200, 590, 390)
    ctx.fillStyle = '#ccc1b4'
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let x = initX + i * (BLOCK_SIZE + SPACE_SIZE);
            let y = initY + j * (BLOCK_SIZE + SPACE_SIZE);
            ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE)
            STATE.push({
                x,
                y,
                value: 0,
                from: STATE.length,
                gen: false
            })
        }
    }
    generate(2)
    await render()
}
function generate(number) {
    const noState = []
    for (let i = 0; i < STATE.length; i++) {
        if (STATE[i].value === 0) {
            noState.push(i)
        }
    }
    if (noState.length === 0) return
    for (let i = 0; i < Math.min(number, noState.length); i++) {
        const curr = noState[random(0, noState.length - 1)]
        STATE[curr].value = Math.random() > 0.5 ? 2 : 4
        STATE[curr].gen = true
    }
}
function renderText(x, y, value) {
    const text = ctx.measureText(value)
    ctx.fillStyle = COLOR_MAP[value].fontStyle;
    ctx.fillText(value, x + BLOCK_SIZE / 2 - text.width / 2, y + BLOCK_SIZE / 2 + 15)
}
async function render() {
    const newRednerList = []
    const moveRenderList = []
    for (let j = 0; j < STATE.length; j++) {
        const { x, y, value, from, gen } = STATE[j]
        if (!value) continue
        ctx.fillStyle = COLOR_MAP[value].fillStyle
        if (j === from && gen) {
            newRednerList.push(j)
            // } else if (j !== from) {
            // moveRenderList.push(j)
        } else {
            moveRenderList.push(j)
            // ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE)
            // renderText(x, y, value)
        }
    }
    await timer((i, count) => {
        clear()
        for (const current of newRednerList) {
            const { x, y, value } = STATE[current]
            let BASE_BLOCK = BLOCK_SIZE / count * i
            ctx.fillStyle = COLOR_MAP[value].fillStyle;
            ctx.fillRect(x + Math.floor((BLOCK_SIZE - BASE_BLOCK) / 2), y + Math.floor((BLOCK_SIZE - BASE_BLOCK) / 2), BASE_BLOCK, BASE_BLOCK)
            if (i === count) {
                renderText(x, y, value)
            }
            STATE[current].gen = false
        }
        for (const current of moveRenderList) {
            const { x, y, value, from } = STATE[current]

            for (const f of Array.isArray(from) ? from : [from]) {
                const diffX = (STATE[f].x - x) / count * (count - i) + x
                const diffY = (STATE[f].y - y) / count * (count - i) + y
                ctx.fillStyle = COLOR_MAP[value].fillStyle;
                ctx.fillRect(diffX, diffY, BLOCK_SIZE, BLOCK_SIZE)
            }
            if (i === count) {
                renderText(x, y, value)
            }
        }
    }, 50, 1)
}
function clear() {
    ctx.fillStyle = '#bbada0';
    ctx.fillRect(0, 200, 590, 390)
    for (let i = 0; i < STATE.length; i++) {
        const { x, y } = STATE[i]
        ctx.fillStyle = '#ccc1b4'
        ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE)
    }
}
function mergeBoxValue(direction) {
    for (let i = direction[0]; i < direction[0] + direction[1] * 3 + 1; i += direction[1]) {
        // 获取每一列的值
        let stack = []
        for (let count = 0; count < 4; count++) {
            const current = i + count * direction[2]
            if (STATE[current].value !== 0) {
                stack.push({
                    value: STATE[current].value,
                    location: current,
                    from: current
                })
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
            if (combine[length - 1].value === current.value) {
                combine[length - 1].value += current.value
                combine[length - 1].from = [combine[length - 1].location, current.location]
                if (stack.length > 0) {
                    combine.push(stack.shift())
                }
                continue
            }
            combine.push(current)
        }
        for (let count = 0; count < 4; count++) {
            if (combine[count]) {
                STATE[i + count * direction[2]].value = combine[count].value
                STATE[i + count * direction[2]].from = combine[count].from
            } else {
                STATE[i + count * direction[2]].value = 0
            }
        }
    }
}

window.onload = initScene
window.addEventListener('keydown', async (e) => {
    const key = e.key
    switch (key) {
        case 'w':
            clear()
            mergeBoxValue(UP)
            generate(1)
            await render()
            break;
        case 'a':
            clear()
            mergeBoxValue(LEFT)
            generate(1)
            await render()
            break;
        case 's':
            clear()
            mergeBoxValue(DOWN)
            generate(1)
            await render()
            break;
        case 'd':
            clear()
            mergeBoxValue(RIGHT)
            generate(1)
            await render()
            break;
        default:
            break;
    }

})



