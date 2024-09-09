import React, {Fragment, useEffect, useRef, useState} from 'react';
import {observer} from "mobx-react-lite";
import canvasState from "@/store/canvasState";
import toolState from "@/store/toolState";
import Brush from "@/tools/brush";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Input} from "@/components/ui/input";
import Rect from "@/tools/rect";
import axios from "axios";
import {useToast} from "@/components/ui/use-toast";
import EraserClass from "@/tools/eraser";
import CircleClass from "@/tools/circle";
import Line from "@/tools/line";
import TextClass from '@/tools/text';
import {Dialog, Transition} from "@headlessui/react";


const Canvas = observer(() => {
    let [isOpen, setIsOpen] = useState(false)
    const [canVote, setCanVote] = useState(true)
    const [canNotVote, setCanNotVote] = useState(false)
    const [protiv, setProtiv] = useState(false)
    const [za, setZa] = useState(false)
    const canvasRef = useRef()
    const usernameRef = useRef()
    const [modal, setModal] = useState(true)
    const {toast} = useToast()
    const [open, setOpen] = useState(true)
    const [alreadyOpen, setAlreadyOpen] = useState(false)
    const descriptions = [
        'Хорошей ему игры!',
        'Присоединяйся к нам!',
        'Теперь будет ещё круче!',
        'Всё только начинается'
    ]
    const descriptionsLeave = [
        'Возвращайся по скорее!',
        'Удачи!',
        'Дорисуешь потом!',
        'Отдохни как следует!'
    ]

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        if(isOpen === false && couner === 0) {
            setIsOpen(true)
            setAlreadyOpen(true)
            couner = 1
            const interval = setInterval(() => {
                const ctx = canvasRef.current.getContext('2d')
                console.log(canvasState.seconds)
                fetch('http://localhost:1205/voteFalsePlayers')
                    .then(data => data.json())
                    .then(data => {
                        canvasState.votePlayers = data
                    });
                fetch('http://localhost:1205/protivFalsePlayers')
                    .then(data => data.json())
                    .then(data => {
                        canvasState.protivVoted = data
                    });
                fetch('http://localhost:1205/zaFalsePlayers')
                    .then(data => data.json())
                    .then(data => {
                        canvasState.zaVoted = data
                    });
                if(canvasState.seconds <= 0 && canvasState.zaVoted > canvasState.protivVoted){
                    couner = 0
                    canvasState.socket.send(JSON.stringify({
                        method: 'endVote'
                    }))
                    setZa(false)
                    setProtiv(false)
                    setCanNotVote(false)
                    setCanVote(true)
                    stopTimer(interval)
                    closeModal()
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    setAlreadyOpen(false)
                    setIsOpen(false)
                    toast({
                        title: `Холст успешно очищен!`,
                        description: 'Так он выглядит гораздо чище!',
                    })
                    canvasState.socket.send(JSON.stringify({
                        method: 'draw',
                        figure: {
                            type: 'clearCanvas',
                        }
                    }))
                    canvasState.seconds = 15
                }
                else if(canvasState.seconds <= 0 && canvasState.zaVoted < canvasState.protivVoted){
                    toast({
                        title: `Холст не очищен!`,
                        description: 'Игроки которые проголосовали за очистку холста в меньшестве!',
                    })
                }
                if(canvasState.seconds > 0){
                    canvasState.seconds--
                }
            },1000)
        }
    }

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d')
        canvasState.setCanvas(canvasRef.current)
        axios.get(`http://localhost:1205/image?id=whiteboard.png `)
            .then(response => {
                const img = new Image()
                img.src = response.data
                img.onload = () => {
                    ctx.fillStyle = toolState.fillColorState
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                }
            })
    }, []);

    useEffect(() => {
        if(canNotVote) {
            fetch('http://localhost:1205/votePlayers')
                .then(data => data.json())
                .then(data => {
                    canvasState.votePlayers = data
                    console.log(`проголосовало ${canvasState.votePlayers}`)
                });
            if (za) {
                fetch('http://localhost:1205/zaPlayers')
                    .then(data => data.json())
                    .then(data => {
                        canvasState.zaVoted = data
                        console.log(`за ${canvasState.zaVoted}`)
                    });
            }
            else {
                fetch('http://localhost:1205/zaFalsePlayers')
                    .then(data => data.json())
                    .then(data => {
                        canvasState.zaVoted = data
                        console.log(`за ${canvasState.zaVoted}`)
                    });
            }
            if (protiv) {
                fetch('http://localhost:1205/protivPlayers')
                    .then(data => data.json())
                    .then(data => {
                        canvasState.protivVoted = data
                        console.log(`против ${canvasState.protivVoted}`)
                    });
            }
            else {
                fetch('http://localhost:1205/protivFalsePlayers')
                    .then(data => data.json())
                    .then(data => {
                        canvasState.protivVoted = data
                        console.log(`против ${canvasState.zaVoted}`)
                    });
            }
        }
    }, [canNotVote]);

    useEffect(() => {
        if(canvasState.username){
            const socket = new WebSocket(`ws://localhost:1205`)
            canvasState.setSocket(socket)
            toolState.setTool(new Brush(canvasRef.current, socket))
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    username: canvasState.username,
                    method: 'connection'
                }))
                fetch('http://localhost:1205/voteFalsePlayers')
                    .then(data => data.json())
                    .then(data => {
                        canvasState.votePlayers = data
                    });
                fetch('http://localhost:1205/protivFalsePlayers')
                    .then(data => data.json())
                    .then(data => {
                        canvasState.protivVoted = data
                    });
                fetch('http://localhost:1205/zaFalsePlayers')
                    .then(data => data.json())
                    .then(data => {
                        canvasState.zaVoted = data
                    });
            }
            window.onbeforeunload = () => { // TODO: реализовать toast с сообщением о выходе игрока
                socket.send(JSON.stringify({ // TODO: реализовать голосование о чистке canvas
                    username: canvasState.username,
                    method: 'leave'
                }))
            }
            socket.onmessage = (e) => {
                let msg = JSON.parse(e.data)
                switch (msg.method){
                    case 'connection':
                        toast({
                            title: `Игрок ${msg.username} присоеденился!`,
                            description: descriptions[Math.floor(Math.random() * 4)],
                        })
                        break
                    case 'draw':
                        drawHandler(msg)
                        break
                    case 'vote':
                        if(!alreadyOpen){
                            openModal()
                        }
                        break
                    case 'leave':
                        toast({
                            title: `Игрок ${msg.username} покинул игру!`,
                            description: descriptionsLeave[Math.floor(Math.random() * 4)],
                        })
                        break
                }
                fetch('http://localhost:1205/playersNumber')
                    .then(data => data.json())
                    .then(data => {
                        canvasState.playersCount = data
                    });
            }
        }
    }, [canvasState.username]);

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        console.log(canvasState.playersCount)
        axios.post(`http://localhost:1205/image?id=whiteboard.png}`, {img: canvasRef.current.toDataURL()})
            .catch(e => console.log(e))
    }

    const mouseUpHandler = () => {
        fetch('http://localhost:1205/voteFalsePlayers')
            .then(data => data.json())
            .then(data => {
                canvasState.votePlayers = data
            });
        fetch('http://localhost:1205/protivFalsePlayers')
            .then(data => data.json())
            .then(data => {
                canvasState.protivVoted = data
            });
        fetch('http://localhost:1205/zaFalsePlayers')
            .then(data => data.json())
            .then(data => {
                canvasState.zaVoted = data
            });
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        console.log(canvasState.playersCount)
        axios.post(`http://localhost:1205/image?id=whiteboard.png}`, {img: canvasRef.current.toDataURL()})
            .catch(e => console.log(e))
    }

    const connectHandler = () => {
        if(usernameRef.current.value === ''){
            toast({
                variant: "destructive",
                title: "Ой ой, у вас пустое поле!",
                description: "Ваш никнейм не может быть пустым :(",
            })
        }
        else {
            setModal(false)
            canvasState.setUsername(usernameRef.current.value)
        }
    }

    const drawHandler = (msg) => {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')
        switch (figure.type){
            case 'brush':
                Brush.draw(ctx, figure.x, figure.y, figure.colorFill, figure.colorStroke, figure.lineWidth)
                break
            case 'finish':
                ctx.beginPath()
                break
            case 'rect':
                Rect.staticDraw(ctx, figure.x, figure.y, figure.w, figure.h, figure.colorFill, figure.colorStroke)
                break
            case 'eraser':
                EraserClass.draw(ctx, figure.x, figure.y, figure.colorFill, figure.colorStroke, figure.lineWidth)
                break
            case 'circle':
                CircleClass.staticDraw(ctx, figure.x, figure.y, figure.r, figure.colorFill, figure.colorStroke)
                break
            case 'line':
                Line.staticDraw(ctx, figure.x, figure.y, figure.startX, figure.startY, figure.colorFill, figure.colorStroke, figure.lineWidth)
                break
            case 'text':
                TextClass.staticDraw(ctx, figure.font, figure.text, figure.size, figure.x, figure.y, figure.colorFill, figure.colorStroke)
                break
            case 'clearCanvas':
                mouseDownHandler()
                ctx.clearRect(0, 0, figure.w, figure.h)
        }
    }

    return (
        <div className='bg-[#F6F6F6] items-center justify-center flex'>
            <AlertDialog defaultOpen={true} open={modal}>
                <AlertDialogTrigger className='hidden'></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Введите ваш никнейм!</AlertDialogTitle>
                        <AlertDialogDescription>
                            Для начало пользования Whiteboard введите ваш никнейм :)
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Input type='text' ref={usernameRef}/>
                        <AlertDialogAction onClick={() => connectHandler()}>Продолжить</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <canvas
                onMouseDown={() => mouseDownHandler()}
                onMouseUp={() => mouseUpHandler()}
                ref={canvasRef}
                width={1400}
                height={700}
                className='border-black border-solid border-2 mt-[17vh]'
            />
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog className="z-10 flex justify-center" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className=""/>
                    </Transition.Child>

                    <div className="fixed flex justify-center top-10">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-5 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Голосование на очистку холста
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Если все игроки проголосуют за очистку холста то
                                            он очистится.
                                        </p>
                                        <h1 className='justify-center items-center flex'>До конца голосования: {canvasState.seconds} сек</h1>
                                        <div className='justify-center items-center flex mt-4'>
                                            <h1 className='font-semibold'>Проголосовало: {canvasState.votePlayers}</h1>
                                        </div>
                                        <div className='grid grid-cols-3 font-semibold'>
                                            <h1 className='ml-[23px] mt-[10px] font-semibold'>За: {canvasState.zaVoted}</h1>
                                            <h1 className='ml-[180px] mt-[10px] w-[200px] font-semibold'>Против: {canvasState.protivVoted}</h1>
                                        </div>
                                    </div>

                                    <div className="mt-4 justify-between">
                                        <button
                                            type="button"
                                            className="inline-flex text-black justify-center font-semibold rounded-md border mx-4 border-transparent bg-green-400 px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => {
                                                if (canVote) {
                                                    setZa(true)
                                                    setCanNotVote(true)
                                                    setCanVote(false)
                                                    closeModal()
                                                }
                                            }}
                                        >
                                            За
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex text-black justify-center font-semibold rounded-md border ml-[230px] border-transparent bg-red-400 px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => {
                                                if (canVote) {
                                                    setProtiv(true)
                                                    setCanNotVote(true)
                                                    setCanVote(false)
                                                    closeModal()
                                                }
                                            }}
                                        >
                                            Против
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
})

export default Canvas;