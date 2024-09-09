import React, {useState} from 'react';
import toolState from "@/store/toolState";
import {Input} from "@/components/ui/input";
import { ComboboxDemo } from './ui/combobox';
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";

const changeColor = (e) => {
    toolState.setFillColor(e)
    toolState.setStrokeColor(e)
}

const SettingBar = () => {
    const [fontState, setFontState] = useState('Times New Roman')
    const [sizeState, setSizeState] = useState('25px')
    const [textState, setTextState] = useState('')


    return (
        <div className='h-[70px] bg-white flex items-center absolute w-[100%] shadow-lg top-10'>
            <div className='ml-[20px] grid-cols-3 grid mt-4'>
                <label htmlFor="line-width" className='font-semibold mt-[6px]'>
                    Толщина линии
                </label>
                <Input
                    className='font-semibold bg-black '
                    id="line-width"
                    type="range"
                    min={1}
                    defaultValue={1}
                    max={50}
                    onChange={e => toolState.setLineWidth(e.target.value)}
                />
            </div>
            <div className='grid-cols-3 grid mt-4 pr-[300px]'>
                <h1 className='top-1 relative font-semibold'>
                    Цвет
                </h1>
                <input
                    className='mt-[3px]'
                    type="color"
                    onChange={e => changeColor(e.target.value)}
                />
            </div>
            <h1 className='mt-3 font-semibold ml-[120px] w-[200px]'>Настройки текста</h1>
            <div className='grid grid-cols-3'>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className='font-semibold px-6 mt-4' variant="outline">Выбрать</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Настройки текста</h4>
                                <p className="text-sm text-muted-foreground">
                                    Тут можно изменять параметры текста
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="width">Текст</Label>
                                    <Input
                                        id="width"
                                        value={textState}
                                        className="col-span-2 h-8"
                                        type="text"
                                        onChange={e => {
                                            toolState.setText(e.target.value)
                                            setTextState(e.target.value)
                                        }}
                                    />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="maxWidth">Размер</Label>
                                    <Input
                                        id="maxWidth"
                                        value={sizeState}
                                        className="col-span-2 h-8"
                                        onChange={e => {
                                            toolState.setSize(e.target.value)
                                            setSizeState(e.target.value)
                                        }}
                                    />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="maxHeight">Шрифт</Label>
                                    <Input
                                        id="maxHeight"
                                        value={fontState}
                                        className="col-span-2 h-8"
                                        onChange={e => {
                                            toolState.setFont(e.target.value)
                                            setFontState(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};

export default SettingBar;