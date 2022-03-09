const http = require("http")
const path = require("path")
const express = require("express")
const socketio =require("socket.io")
const Filter =require("bad-words")
const {  generatemessage,generateurl } = require("./utils/messages")
const {addUser,
    removeUser,
    getUser,
    getUsersInRoom} =require("./utils/users")
const app =express()
const server =http.createServer(app)
const io =socketio(server)
const port =process.env.PORT || 3000
const publicdirectorypath = path.join(__dirname,"../public")
app.use(express.static(publicdirectorypath))


io.on("connection",(socket)=>{
console.log("new connection");

socket.on("join",(option,callback)=>{
  const {error,user} =  addUser({ id:socket.id,...option})
if(error){
   return  callback(error)
}

socket.join(user.room)

socket.emit("message",generatemessage("welcome"))
socket.broadcast.to(user.room).emit("message",generatemessage(`${user.username} has joined the chat`))
//socket.emmit,io.emmit,socket.broadcast


callback()

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
    const user = removeUser(socket.id)
    if(user){
 io.to(user.room).emit("message",generatemessage(`${user.username} has left`))
    }

})
})
server.listen(port,()=>{
    console.log(`server is up and running on port ${port}`);
})
 