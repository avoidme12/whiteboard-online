import Tool from "@/tools/tool";
import toolState from "@/store/toolState";

export default class BrushClass extends Tool{
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
                type: 'finish',
            }
        }))
    }

    mouseDownHandler(e){
        this.mouseDown = true
        this.ctx.beginPath()
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
    }

    mouseMoveHandler(e){
        if(this.mouseDown){
            // this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
            this.socket.send(JSON.stringify({
                method: 'draw',
                figure: {
                    type: 'brush',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    colorFill: toolState.fillColorState,
                    colorStroke: toolState.strokeColorState,
                    lineWidth: this.ctx.lineWidth
                }
            }))
        }
    }

    static draw(ctx, x, y, colorFill, colorStroke, lineWidth){
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = colorStroke
        ctx.fillStyle = colorFill
        ctx.lineTo(x, y)
        ctx.stroke()
    }
}