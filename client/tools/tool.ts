export default class Tool{

    canvas = null
    ctx = null
    socket = null

    constructor(canvas, socket) {
        this.canvas = canvas
        this.socket = socket
        this.ctx = canvas.getContext('2d')
        this.destroyEvents()
    }

    set fillColor(color){
        this.ctx.fillStyle = color
    }

    set strokeColor(color){
        this.ctx.strokeStyle = color
    }

    set lineWidth(width){
        this.ctx.lineWidth = width
    }


    destroyEvents(){
        this.canvas.onmousemove = null
        this.canvas.onmouseup = null
        this.canvas.onmousedown = null
    }
}