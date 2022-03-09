

const socket =io()
//elements
const $messageform =document.querySelector("#message-form")
const $messageforminput =$messageform.querySelector("input")
const $messagebutton =$messageform.querySelector("button")
const $sendlocationbutton=document.querySelector("#sendlocation")
const $messages =document.querySelector("#messages")
//templates
const messagetemplate =document.querySelector("#message-template").innerHTML
const locationtemplate =document.querySelector("#location-template").innerHTML
const sidebartemplate =document.querySelector("#sidebar-template").innerHTML

//options
const {username,room}= Qs.parse(location.search,{
    ignoreQueryPrefix:true
})



const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on("message",(message)=>{
    console.log(message);
    const html =Mustache.render(messagetemplate,{
        username:message.username,
        message:message.text,
        createdat:moment(message.createdat).format("h:mm a")
    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
})
socket.on("locationmessage",(message)=>{

const html =Mustache.render(locationtemplate,{
    username:message.username,
    url:message.url,
    createdat:moment(message.createdat).format("+h:mm a")
})
$messages.insertAdjacentHTML("beforeend",html)
autoscroll()
})
socket.on("roomdata",({room,users})=>{
   const html =Mustache.render(sidebartemplate,{
       room,
       users
   })
   document.querySelector("#sidebar").innerHTML =html
})
document.querySelector("#message-form").addEventListener("submit",(e)=>{
    e.preventDefault()
    //disable
    $messagebutton.setAttribute("disabled","disabled")
    const message =document.querySelector("input").value
    socket.emit("sendmessage",message,(error)=>{
        $messagebutton.removeAttribute("disabled")
        $messageforminput.value=""
        $messageforminput.focus() 
        //enable
        if(error){
            return console.log(error);
        }
        console.log("Message delivered");
    })
})
$sendlocationbutton.addEventListener("click",()=>{
    if(!navigator.geolocation){
        return alert("geolocation is not supported by your browser")
    }
    $sendlocationbutton.setAttribute("disabled","disabled")
    navigator.geolocation.getCurrentPosition((position)=>{
        
        socket.emit("sendlocation",{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $sendlocationbutton.removeAttribute("disabled")
            console.log("location shared");
        })
    })
})
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})