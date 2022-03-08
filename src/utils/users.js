const users =[]

// add user
// remove user
//get user
//get user in room
const adduser=({id,username,room})=>{
// clean the data
username=username.trim().toLowerCase()
room=room.trim().toLowerCase()
//validate the data
if(!username || !room){
    return {
        error:"username and room are required"
    }
}


//check for existing user
const existinguser =users.find((user)=>{
 return user.room ===room && user.username ===username
})
// validate username
if(existinguser){
    return {
        error:"username is in use"
    }
}
//store the user
const userop = {id,username,room}
users.push(userop)
return{userop}
}

const removeuser =(id)=>{
  const index = users.findIndex((user)=>{
      return user.id === id

  })
  if(index!==1){
      return users.splice(index,1)[0]
  }

}
const getuser =(id)=>{
    return users.find((useropo)=>{
useropo.id === id
    })

}
adduser({
    id:11,
    username:"ankfdsaush",
    room:"america"
})
adduser({
    id:22,
    username:"ddfankush",
    room:"america"
})


const user =getuser(11)
console.log(user);

