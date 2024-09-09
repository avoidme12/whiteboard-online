import { Dialog, Transition } from '@headlessui/react'
import {Fragment, useEffect, useState} from 'react'
import canvasState from "@/store/canvasState";

export default function MyModal() {
    let [isOpen, setIsOpen] = useState(true)
    const [canVote, setCanVote] = useState(true)
    const [canNotVote, setCanNotVote] = useState(false)

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }


    return (
        <>
        </>
    )
}
