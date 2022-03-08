const http = require("http")
const path = require("path")
const express = require("express")
const socketio =require("socket.io")
const Filter =require("bad-words")
const {  generatemessage,generateurl } = require("./utils/messages")

const app =express()
const server =http.createServer(app)
const io =socketio(server)
const port =process.env.PORT || 3000
const publicdirectorypath = path.join(__dirname,"../public")
app.use(express.static(publicdirectorypath))


io.on("connection",(socket)=>{
console.log("new connection");

socket.on("join",({username,room})=>{
socket.join(room)

socket.emit("message",generatemessage("welcome"))
socket.broadcast.to(room).emit("message",generatemessage(`${username} has joined the chat`))
//socket.emmit,io.emmit,socket.broadcast
//io.to.emit
})
socket.on("sendmessage",(message,callback)=>{  
    const filter =new Filter()
    if(filter.isProfane(message)){
        return callback("foul language is not allowed")
    }
    io.emit("message",generatemessage(message))
    callback("Delivered!")
})
socket.on("sendlocation",(coords,callback)=>{
    io.emit("locationmessage",generateurl(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
    callback()
})
socket.on("disconnect",()=>{
    io.emit("message",generatemessage("a user has left"))
})
})
server.listen(port,()=>{
    console.log(`server is up and running on port ${port}`);
})
