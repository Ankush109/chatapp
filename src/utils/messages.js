const generatemessage =(text)=>{
    return {
        text,
        createdat:new Date().getTime()
    }
}
const generateurl =(url)=>{
    return {
        url,
        createdat:new Date().getTime()
    }
}
module.exports = {
    generatemessage,generateurl
}