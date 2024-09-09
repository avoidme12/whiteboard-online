import Tool from "@/tools/tool";
import * as timers from "node:timers";
import toolState from "@/store/toolState";

export default class Rect extends Tool{
    saved = null
    startX = null
    startY = null
    width = null
    height = null
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
                type: 'rect',
                x: this.startX,
                y: this.startY,
                w: this.width,
                h: this.height,
                colorFill: toolState.fillColorState,
                colorStroke: toolState.strokeColorState,
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
            this.height = currentY - this.startY
            this.draw(this.startX, this.startY, this.width, this.height)
        }
    }

    draw(x, y, w, h){
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.fillStyle = toolState.fillColorState
            this.ctx.strokeStyle = toolState.strokeColorState
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.rect(x, y, w, h)
            this.ctx.fill()
            this.ctx.stroke()
        }
    }

    static staticDraw(ctx, x, y, w, h, colorFill, colorStroke){
        ctx.strokeStyle = colorStroke
        ctx.fillStyle = colorFill
        ctx.beginPath()
        ctx.rect(x, y, w, h)
        ctx.fill()
        ctx.stroke()
    }
}