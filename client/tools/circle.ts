import Tool from "@/tools/tool";
import toolState from "@/store/toolState";

export default class CircleClass extends Tool{
    saved = null
    startX = null
    startY = null
    radius = null
    width = null
    constructor(canvas, socket) {
        super(canvas, socket);
        this.listen()
    }

    listen(){
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    }

    mouseUpHandler(e){
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: 'draw',
            figure: {
                type: 'circle',
                x: this.startX,
                y: this.startY,
                r: this.radius,
                colorFill: toolState.fillColorState,
                colorStroke: toolState.strokeColorState
            }
        }))
    }

    mouseDownHandler(e){
        this.mouseDown = true
        this.ctx.beginPath()
        this.startX = e.pageX - e.target.offsetLeft
        this.startY = e.pageY - e.target.offsetTop
        this.saved = this.canvas.toDataURL()
    }

    mouseMoveHandler(e){
        if(this.mouseDown){
            let currentX = e.pageX - e.target.offsetLeft
            let currentY = e.pageY - e.target.offsetTop
            this.width = currentX - this.startX
            let height = currentY - this.startY
            this.radius = currentX - this.startX
            if(this.radius <= 0){
                this.radius = 0
            }
            this.draw(this.startX, this.startY, this.radius)
        }
    }

    draw(x, y, r){
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.strokeStyle = toolState.strokeColorState
            this.ctx.fillStyle = toolState.fillColorState
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.arc(x, y, r, 0, 2 * Math.PI);
            this.ctx.fill()
            this.ctx.stroke()
        }
    }

    static staticDraw(ctx, x, y, r, colorFill, colorStroke){
        ctx.strokeStyle = colorStroke
        ctx.fillStyle = colorFill
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
    }
}