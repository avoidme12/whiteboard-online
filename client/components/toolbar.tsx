'use client'
import React from 'react';
import {Brush, Circle, Eraser, Minus, Palette, Redo, Save, Square, Text, TextIcon, Type, Undo} from "lucide-react";
import BrushClass from '../tools/brush'
import toolState from "@/store/toolState";
import canvasState from "@/store/canvasState";
import Rect from "@/tools/rect";
import CircleClass from "@/tools/circle";
import EraserClass from "@/tools/eraser";
import Line from "@/tools/line";
import canvas from "@/components/canvas";
import TextClass from "@/tools/text";
import {Button} from "@/components/ui/button";

const Toolbar = () => {
    return (
        <div className='h-[60px] bg-white flex items-center absolute w-[100%] shadow-lg z-40'>
            <div
                className='h-6 w-6 border-none outline-none cursor-pointer bg-cover ml-[10px] grid grid-cols-11 gap-[60px] mb-2'>
                <button onClick={() => toolState.setTool(new BrushClass(canvasState.canvas, canvasState.socket))}>
                    <Brush size={30}/>
                </button>
                <button onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket))}>
                    <Square size={30}/>
                </button>
                <button onClick={() => toolState.setTool(new CircleClass(canvasState.canvas, canvasState.socket))}>
                    <Circle size={30}/>
                </button>
                <button onClick={() => toolState.setTool(new EraserClass(canvasState.canvas, canvasState.socket))}>
                    <Eraser size={30}/>
                </button>
                <button onClick={() => toolState.setTool(new Line(canvasState.canvas, canvasState.socket))}>
                    <Minus size={30}/>
                </button>
                <button onClick={() => toolState.setTool(new TextClass(canvasState.canvas, canvasState.socket))}>
                    <Type size={30}/>
                </button>
                <div>
                    <button className='font-semibold w-[200px] mt-1' onClick={() => canvasState.socket.send(JSON.stringify({
                        method: 'vote'
                    }))}>
                        Очистить холст
                    </button>
                </div>
                <div className='grid grid-cols-11 gap-11 ml-[74vw]'>
                    <button onClick={() => canvasState.save()}>
                        <Save size={30}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toolbar;