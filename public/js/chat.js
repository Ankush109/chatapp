const socket =io()
//elements
const $messageform =document.querySelector("#message-form")
const $messageforminput =$messageform.querySelector("input")
const $messagebutton =$messageform.querySelector("button")
const $sendlocationbutton=document.querySelector("#sendlocation")
const $messages =document.querySelector("#messages")
//templates
const messagetemplate =document.querySelector("#message-template").innerHTML
socket.on("message",(message)=>{
    console.log(message);
    const html =Mustache.render(messagetemplate)
    $messages.insertAdjacentElement("beforeend",html)
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