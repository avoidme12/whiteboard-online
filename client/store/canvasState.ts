import {makeAutoObservable} from "mobx";

class CanvasState{
    canvas = null
    socket = null
    undoList = []
    redoList = []
    username = ''
    playersCount = 0
    zaVoted = 0
    protivVoted = 0
    votePlayers = 0
    seconds = 15
    isOpen = false
    constructor() {
        makeAutoObservable(this)
    }

    setCanvas(canvas){
        this.canvas = canvas
    }

    setUsername(username){
        this.username = username
    }

    setSocket(socket){
        this.socket = socket
    }

    pushToUndo(data){
        this.undoList.push(data)
    }

    pushToRedo(data){
        this.redoList.push(data)
    }

    undo(){
        let ctx = this.canvas.getContext('2d')
        if(this.undoList.length > 0){
            let dataUrl = this.undoList.pop()
            let img = new Image()
            this.redoList.push(this.canvas.toDataURL())
            img.src = dataUrl
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                ctx.drawImage(img, 0,  0, this.canvas.width, this.canvas.height)
            }
        }   else {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
        this.socket.send(JSON.stringify({
            method: 'undo',
        }))
    }

    redo(){
        let ctx = this.canvas.getContext('2d')
        if(this.redoList.length > 0){
            let dataUrl = this.redoList.pop()
            this.undoList.push(this.canvas.toDataURL())
            let img = new Image()
            img.src = dataUrl
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                ctx.drawImage(img, 0,  0, this.canvas.width, this.canvas.height)
            }
        }
    }

    save(){
        let data = this.canvas.toDataURL('imag/png')
        let a = document.createElement('a')
        a.href = data
        a.download = 'whiteboard.png'
        a.click()
        console.log(data)
    }
}

export default new CanvasState()