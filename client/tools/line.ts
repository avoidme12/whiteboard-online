import Tool from "@/tools/tool";
import * as timers from "node:timers";
import toolState from "@/store/toolState";

export default class Line extends Tool{
    saved = null
    startX = null
    startY = null
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
                type: 'line',
                x: e.pageX - e.target.offsetLeft,
                y: e.pageY - e.target.offsetTop,
                startX: this.startX,
                startY: this.startY,
                colorFill: toolState.fillColorState,
                colorStroke: toolState.strokeColorState,
                lineWidth: this.ctx.lineWidth
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
            let width = currentX - this.startX
            let height = currentY - this.startY
            this.draw(currentX, currentY)
        }
    }

    draw(x, y){
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.fillStyle = toolState.fillColorState
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.moveTo(x, y)
            this.ctx.lineTo(this.startX, this.startY)
            this.ctx.fill()
            this.ctx.stroke()
        }
    }

    static staticDraw(ctx, x, y, startX, startY, fillColor, strokeColor, widthLine){
        ctx.fillStyle = fillColor
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = widthLine
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(startX, startY)
        ctx.fill()
        ctx.stroke()
    }
}