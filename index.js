const express  =  require('express');
const cors =  require('cors');
const fs =  require('fs').promises
const app = express();
app.use(cors())
app.use(express.json())

let registerUserDetails = (req,res,next)=>{
    let userData = req.body
    let userName = userData.userName;
    let mobileNumber = userData.mobileNumber
    let email = userData.email
    let password = userData.password

    let userNameRegex = /^[a-zA-Z0-9_]{3,15}$/
    let mobileNumberRegex =  /^[0-9]{10}$/
    let emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+.(com|yahoo|in|outlook)$/
    let passswordRegex = /^[a-zA-z0-9@!#$&*]{8,12}$/
   let result =  userNameRegex.test(userName) && mobileNumberRegex.test(mobileNumber) && emailRegex.test(email) && passswordRegex.test(password)
   if(result){
    next()
   }else{
    res.json('Please enter Valid Deatils')
   }
}

app.post('/register',registerUserDetails,async(req,res)=>{
    let userData = req.body
    let existingUsers = JSON.parse(await fs.readFile("./data.json","utf8"));
    let isExistingUser = existingUsers.find(user=>
        userData.email == user.email ||
        userData.userName == user.userName ||
        userData.mobileNumber == user.mobileNumber
    )
    // console.log(isExistingUser)
    if(!isExistingUser){
        existingUsers.push(userData)
        let updatedData = existingUsers
        await fs.writeFile('./data.json',JSON.stringify(updatedData));
        res.status(200).send({message:"Data Updated",updatedData: updatedData})
    }else{
        res.status(400).send({message:'Email  or Mobile Number Already Exists'})
    }
})

let loginUserData = (req,res,next)=>{
    let userData = req.body;
    let userName = userData.userName;
    let password = userData.password

    let userNameRegex = /^[a-zA-Z0-9_]{3,15}$/
    let passswordRegex = /^[a-zA-z0-9@!#$&*]{8,12}$/
    let result =  userNameRegex.test(userName) && passswordRegex.test(password)
    if(result){
     next()
    }else{
     res.json('Please enter Valid Deatils')
    }
}

app.post('/login', loginUserData ,async (req,res)=>{
    let userData = req.body
    let existingUsers = JSON.parse(await fs.readFile("./data.json","utf8"));
    let isExistingUser = existingUsers.find(user=>userData.userName == user.userName && userData.password == user.password)
    if(isExistingUser){
        res.status(200).send({message:"Entered Correct Details"})
    }else{
        res.status(400).send({message:'Enter correct Details'})
    }

})



app.listen(3555, ()=>{
    console.log('Server started...')
})