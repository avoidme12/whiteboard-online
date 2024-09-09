import Tool from "@/tools/tool";
import toolState from "@/store/toolState";

export default class TextClass extends Tool{
    constructor(canvas, socket) {
        super(canvas, socket);
        this.listen()
    }


    listen(){
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    }

    mouseUpHandler(e){
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: 'draw',
            figure: {
                type: 'text',
                x: e.pageX - e.target.offsetLeft,
                y: e.pageY - e.target.offsetTop,
                colorFill: toolState.fillColorState,
                colorStroke: toolState.strokeColorState,
                size: toolState.size,
                font: toolState.font,
                text: toolState.text
            }
        }))
        this.ctx.beginPath()
        this.draw(toolState.font, toolState.text,toolState.size,e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
    }

    mouseDownHandler(e){
        this.mouseDown = true
    }


    draw(font, text, size, x, y){
        this.ctx.strokeStyle = toolState.strokeColorState
        this.ctx.fillStyle = toolState.fillColorState
        this.ctx.font = size + " " + font
        this.ctx.fillText(text,x,y)
    }

    static staticDraw(ctx, font, text, size, x, y, strokeColor, fillColor){
        ctx.strokeStyle = strokeColor
        ctx.fillStyle = fillColor
        ctx.font = size + " " + font
        ctx.fillText(text,x,y)
    }
}