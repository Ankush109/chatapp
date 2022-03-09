const generatemessage =(username,text)=>{
    return {
        username,
        text,
        createdat:new Date().getTime()
    }
}
const generateurl =(username,url)=>{
    return {
        username,
        url,
        createdat:new Date().getTime()
    }
}
module.exports = {
    generatemessage,generateurl
}