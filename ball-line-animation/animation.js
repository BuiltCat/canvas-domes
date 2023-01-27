function random(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

class Ball {
    /**
     * 球形类
     * @param {number} radius 球形半径
     * @param {number} speed 球的速度
     * @param {number} color 球的颜色
     * @param {number} canvasWidth 球的颜色
     * @param {number} canvasHeight 球的颜色
     */
    constructor(radius, speed, color, canvas) {
        this.x = random(radius, canvas.width - radius);
        this.y = random(radius, canvas.height - radius);
        this.radius = radius;
        this.speed = speed;
        this.color = color;
        this.canvas = canvas
        this.direction = Math.random() > 0.5 ? random(1, 4) : random(6, 9);
    }


    boundaryDetection() {
        if (this.y < this.radius || this.y > this.canvas.height - this.radius || this.x < this.radius || this.x > this.canvas.width - this.radius) {
            this.direction = 10 - this.direction
        }
    }

    move() {
        this.boundaryDetection()
        /** 
         * 1 左下
         * 2 下
         * 3 右下
         * 4 左
         * 6 右
         * 7 左上
         * 8 上
         * 9 右上
         */
        if (this.direction === 1) {
            this.x -= this.speed;
            this.y += this.speed;
        }
        if (this.direction === 2) {
            this.y += this.speed;
        }
        if (this.direction === 3) {
            this.x += this.speed;
            this.y += this.speed;
        }
        if (this.direction === 4) {
            this.x -= this.speed;
        }
        if (this.direction === 6) {
            this.x += this.speed;
        }
        if (this.direction === 7) {
            this.x -= this.speed;
            this.y -= this.speed;
        }
        if (this.direction === 8) {
            this.y -= this.speed;
        }
        if (this.direction === 9) {
            this.x += this.speed;
            this.y -= this.speed;
        }
    }
}

class BallLineAnimation {

    constructor(canvas, number, radius, speed, ballColor, length, lineColor) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d');
        this.length = length;
        this.radius = radius
        this.speed = speed
        this.ballColor = ballColor
        this.lineColor = lineColor
        this.balls = []
        this.number = number || 6;
        for (let i = 0; i < this.number; i++) {
            const ball = new Ball(radius, speed, ballColor, canvas)
            this.balls.push(ball)
        }
        if (this.ctx) {
            this.animation = window.setInterval(this.start.bind(this), 60)
        }
    }

    start() {
        this.clearAll();
        this.drewLine();
        this.drawBall();
        this.moveBall();
    }

    getdistance(a, b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }

    drewLine() {
        for (let i = 0; i < this.balls.length - 1; i++) {
            for (let j = i + 1; j < this.balls.length; j++) {
                if (this.length && this.getdistance(this.balls[i], this.balls[j]) > this.length) continue
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.lineColor;
                this.ctx.lineWidth = 0.2;
                this.ctx.moveTo(this.balls[i].x, this.balls[i].y);
                this.ctx.lineTo(this.balls[j].x, this.balls[j].y);
                this.ctx.closePath();
                this.ctx.stroke();

            }
        }
    }

    drawBall() {
        for (const ball of this.balls) {
            this.ctx.beginPath()
            this.ctx.fillStyle = ball.color
            this.ctx.arc(ball.x, ball.y, ball.radius, 0, 360, 0)
            this.ctx.fill()
            this.ctx.closePath()
        }
    }

    moveBall() {
        for (const ball of this.balls) {
            ball.move()
        }
    }

    clearAll() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    changeNumber(number) {
        console.log(number)
        const diff = number - this.number
        console.log(diff, number, this.number)
        this.number = number
        if (diff > 0) {
            for (let i = 0; i < diff; i++) {
                this.balls.push(new Ball(this.radius, this.speed, this.ballColor, this.canvas))
            }
        }
        if (diff < 0) {
            for (let i = 0; i < -diff; i++) {
                this.balls.pop()
            }
        }
    }

    changeBallColor(ballColor) {
        this.ballColor = ballColor
        for (const ball of this.balls) {
            ball.color = ballColor
        }
    }

    changeLineColor(lineColor) {
        this.lineColor = lineColor
    }

    changeRadius(radius) {
        this.radius = radius
        for (const ball of this.balls) {
            ball.radius = radius
        }
    }

    changeSpeed(speed) {
        this.speed = speed
        for (const ball of this.balls) {
            ball.speed = speed
        }
    }

    changeLength(length) {
        this.length = length
    }

    stop() {
        this.clearAll()
        clearInterval(this.animation)
    }

}