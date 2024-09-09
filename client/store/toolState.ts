import {makeAutoObservable} from "mobx";

class ToolState{
    tool = ''
    strokeColorState = "#000000"
    fillColorState = "#000000"
    text = ''
    font = 'Impact'
    size = '25px'
    constructor() {
        makeAutoObservable(this)
    }

    setTool(tool){
        this.tool = tool
    }
    
    setText(text){
        this.text = text
    }

    setFont(font){
        this.font = font
    }

    setSize(size){
        this.size = size
    }

    setFillColor(color){
        this.fillColorState = color
        this.tool.fillColor = this.fillColorState
    }


    setStrokeColor(color){
        this.strokeColorState = color
        this.tool.strokeColor = this.strokeColorState
    }

    setLineWidth(width){
        this.tool.lineWidth = width
    }

}

export default new ToolState()