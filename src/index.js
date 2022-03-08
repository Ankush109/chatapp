const http = require("http")
const path = require("path")
const express = require("express")
const socketio =require("socket.io")
const Filter =require("bad-words")
const app =express()
const server =http.createServer(app)
const io =socketio(server)
const port =process.env.PORT || 3000
const publicdirectorypath = path.join(__dirname,"../public")
app.use(express.static(publicdirectorypath))


io.on("connection",(socket)=>{
console.log("new connection");
socket.emit("message","welcome")
socket.broadcast.emit("message","a new user has joined")
socket.on("sendmessage",(message,callback)=>{  
    const filter =new Filter()
    if(filter.isProfane(message)){
        return callback("foul language is not allowed")
    }
    io.emit("message",message)
    callback("Delivered!")
})
socket.on("sendlocation",(coords,callback)=>{
    io.emit("message",`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    callback()
})
socket.on("disconnect",()=>{
    io.emit("message","a user has left")
})
})
server.listen(port,()=>{
    console.log(`server is up and running on port ${port}`);
})
