const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const cors = require('cors')
const aWss = WSServer.getWss()
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 1205
const router = require('express').Router()
let playersCount = 0
let zaVoted = 0
let protivVoted = 0
let votePlayers = 0

app.use(cors())
app.use(express.json({limit: '100mb'}))

app.ws('/', (ws, req) => {
    ws.on('message', (msg) => {
        msg = JSON.parse(msg)
        switch (msg.method){
            case "connection":
                playersCount++
                console.log(playersCount)
                connectionHandler(ws, msg)
                break
            case 'draw':
                broadcastConnection(ws, msg)
                break
            case 'leave':
                connectionHandler(ws, msg)
                playersCount--
                console.log(playersCount)
                break
            case 'vote':
                broadcastConnection(ws, msg)
                break
            case 'endVote':
                zaVoted = 0
                protivVoted = 0
                votePlayers = 0
                break
        }
    })
})

app.get('/protivPlayers', (req, res) => {
    protivVoted++
    res.json(protivVoted)
})

app.get('/zaPlayers', (req, res) => {
    zaVoted++
    res.json(zaVoted)
})

app.get('/protivFalsePlayers', (req, res) => {
    res.json(protivVoted)
})

app.get('/zaFalsePlayers', (req, res) => {
    res.json(zaVoted)
})

app.get('/votePlayers', (req, res) => {
    votePlayers++
    res.json(votePlayers)
})

app.get('/voteFalsePlayers', (req, res) => {
    res.json(votePlayers)
})

app.get('/playersNumber', (req, res) => {
    res.json(playersCount)
})

app.post('/image', (req, res) => {
    try {
        const data = req.body.img.replace(`data:image/png;base64`, '')
        fs.writeFileSync(path.resolve(__dirname, 'files', 'whiteboard.png'), data, 'base64')
        return res.status(200).json()
    }
    catch (e) {
        console.log(e)
        return res.status(500).json()
    }
})
app.get('/image', (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', 'whiteboard.png'))
        const data  = 'data:image/png;base64,' + file.toString('base64')
        res.json(data)
    }
    catch (e) {
        console.log(e)
        return res.status(500).json('error')
    }
})

app.listen(PORT, () => console.log(`server start on ${PORT} port`))

const connectionHandler = (ws, msg) => {
    ws.id = msg.id
    broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if(client.id === msg.id){
            client.send(JSON.stringify(msg))
        }
    })
}