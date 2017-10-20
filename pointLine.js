var point = {
    canvas: document.getElementById('background'),
    ctx: document.getElementById('background').getContext('2d'),
    x: 0,
    y: 0,
    r: 0,
    direction:5,
    speed: 2,
    number: 6,
    width: document.body.clientWidth,
    height:document.body.clientHeight,
    local: [],
    init: function(canvasId, speed, number) {
        this.canvas = document.getElementById(canvasId),
        this.ctx = document.getElementById(canvasId).getContext('2d'),
        this.canvas.width = this.width
        this.canvas.height = this.height
        if(speed){
            this.speed = speed
        }
        if(number){
            this.number = number
        }
        if(this.ctx){
            this.setPoint()
            window.setTimeout(point.startAnimation,0)
            console.log(this.local)
            return true
        }else{
            return false
        }
    },
    clear: function () {
        this.ctx.clearRect(0, 0, this.width, this.height)
    },
    getRand: function () {
        this.x = Math.random()*this.width
        this.y = Math.random()*this.height
        this.r = Math.ceil(Math.random()*10+5)
    },
    setPoint: function () {
        this.getRand()
        for(var i = 0; i < this.number; i++){
            for(var j = 0; j < this.number; j++){
                var flag = true
                while(flag){
                    if(this.x<this.width*i/this.number||this.x>this.width*(i+1)/this.number||this.y<this.height*j/this.number||this.y>this.height*(j+1)/this.number){
                        this.getRand()
                    }else{ 
                        var isMove = Math.random()*8
                        for(var d = 8;d > 0; d--){
                            if(d-1 < isMove && isMove <= d){
                                if(d-0.125 < isMove && isMove <= d){
                                    this.direction = 1
                                }else if(d-0.250 < isMove && isMove <= d-0.125){
                                    this.direction  = 2
                                }else if(d-0.375 < isMove && isMove <= d-0.250){
                                    this.direction  = 3
                                }else if(d-0.500 < isMove && isMove <= d-0.375){
                                    this.direction  = 4
                                }else if(d-0.625 < isMove && isMove <= d-0.500){
                                    this.direction  = 6
                                }else if(d-0.750 < isMove && isMove <= d-0.625){
                                    this.direction  = 7
                                }else if(d-0.875 < isMove && isMove <= d-0.750){
                                    this.direction  = 8
                                }else if(d-1.000 < isMove && isMove <= d-0.875){
                                    this.direction  = 9
                                }
                            }
                        }
                        this.local.push([this.x, this.y, this.r, this.direction])
                        flag = false
                    }
                }
            }
        }
    },
    drawPoint: function () {
        this.local.forEach(function(a) {
            this.ctx.beginPath()
            this.ctx.fillStyle = "rgba(144,238,144,0.7)"
            this.ctx.arc(a[0], a[1], a[2], 0, 360, 0)
            this.ctx.fill()
            this.ctx.closePath()
        }, this)
    },
    getdistance: function (pointax, pointay, pointbx, pointby) {
        var l = Math.sqrt(Math.pow(pointax - pointbx,2) + Math.pow(pointay - pointby,2))
        return l;
    },
    setLine: function () {
        for(var i = 0; i < this.local.length-1; i++) {
            for(var j = i+1; j < this.local.length; j++) {
                if(this.getdistance(this.local[i][0], this.local[i][1],this.local[j][0], this.local[j][1]) < 0.2*this.getdistance(0, 0,this.height, this.width)) {
                    this.ctx.beginPath()
                    this.ctx.strokeStyle = "rgb(152,251,152)"
                    this.ctx.lineWidth = 0.2
                    this.ctx.moveTo(this.local[i][0], this.local[i][1])
                    this.ctx.lineTo(this.local[j][0], this.local[j][1])
                    this.ctx.closePath()
                    this.ctx.stroke()
                }        
            }
        }
    },
    movePoint: function () {
        this.local.forEach(function (data) {
            if(data[1] < -50){
                switch (data[3]){
                    case 7:
                        data[3] = 3;
                        break;
                    case 8:
                        data[3] = 2;
                        break;
                    case 9:
                        data[3] = 1;
                        break;
                }
            }
            if(data[1] > this.height + 50){
                switch (data[3]){
                    case 1:
                        data[3] = 9;
                        break;
                    case 2:
                        data[3] = 8;
                        break;
                    case 3:
                        data[3] = 7;
                        break;
                }
            }
            if(data[0] < -50){
                switch (data[3]){
                    case 7:
                        data[3] = 3;
                        break;
                    case 4:
                        data[3] = 6;
                        break;
                    case 1:
                        data[3] = 9;
                        break;
                }
            }
            if(data[0] > this.width + 50){
                switch (data[3]){
                    case 9:
                        data[3] = 1;
                        break;
                    case 6:
                        data[3] = 4;
                        break;
                    case 3:
                        data[3] = 7;
                        break;
                }
            }
            switch (data[3]){
                case 1:
                    data[0] -= this.speed;
                    data[1] += this.speed;
                    break;
                case 2:
                    data[1] += this.speed;
                    break;
                case 3:
                    data[0] += this.speed;
                    data[1] += this.speed;
                    break;
                case 4:
                    data[0] -= this.speed;
                    break;
                case 6:
                    data[0] += this.speed;
                    break;
                case 7:
                    data[0] -= this.speed;
                    data[1] -= this.speed;
                    break;
                case 8:
                    data[1] -= this.speed;
                    break;
                case 9:
                    data[0] += this.speed;
                    data[1] -= this.speed;
                    break;
            }
        },this)
    },
    startAnimation: function() {
        point.clear()
        point.setLine()
        point.drawPoint()
        point.movePoint()
        window.setTimeout(point.startAnimation,60)
    }
}
function main() {
    var canvasId = 'background'
    point.init(canvasId, 5, 5)
}
main()