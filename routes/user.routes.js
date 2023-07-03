import express from 'express';
import { client } from '../index.js';
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'
import { CreateUser, EditUser, deleteUserById, getAllUsers, getUserByEmail, getUserById, getUserByName } from "../services/user.services.js";
dotenv.config();
// import nodemailer from "nodemailer";
import {auth} from '../middleware/auth.js';
import crypto from "crypto";

async function genHashedPassword(password){
    const NO_OF_ROUND = 10;
    const salt = await bcrypt.genSalt(NO_OF_ROUND);
    const hashedPassword = await bcrypt.hash(password,salt);
    console.log(salt);
    console.log(hashedPassword);
    return hashedPassword;
  }

  router.get('/', async function(request, response){          //✔️

    const userFromDb = await getAllUsers(request);
    console.log(userFromDb);
    if(!userFromDb){
      response.status(400).send({msg:"error in getting user"})
    }else{
      response.status(200).send(userFromDb)
    }
  })

  router.delete('/delete/:id', async function(request, response){          //✔️

    const { id } = request.params;
    const userFromDb = await  getUserById(id);

    if(!userFromDb){
      response.status(400).send({msg:"error in getting user"})
    }else{
      await deleteUserById(id);
      response.status(200).send({users:userFromDb, msg: "user deleted"})
    }
  })

  router.get('/:id', async function(request, response){          

    try{
      const { id } = request.params;
      console.log(id)
      const userFromDb = await getUserById(id);
      console.log(userFromDb);
      if(userFromDb){
        response.status(200).send({users:userFromDb})
      }else{
        response.status(400).send({msg:"error in getting user", err:err})
      }
    }catch(error){
      response.status(400).send({msg:"error in getting user", error: error})
    }
   
  })

  router.put('/editprofile/:id', async function(request, response){          

    const { id } = request.params;
    const {name, email} = request.body;

    let userFromDb = await getUserById(id);
    const data = {
      name: name,
      email:email,
    }
    if(!userFromDb){
      response.status(400).send({msg:"error in getting user"})
    }else{
      const changes = await EditUser({data:data},{id:id})
      console.log(userFromDb)
      const changed = await  getUserById(id);
      response.status(200).send({users:changed, msg : "user details edited successfully"})
    }
  })

  router.post('/register', async function(request, response){     //✔️
    const {username,email,password} = request.body; 
    console.log(request.body)

    const userFromDb = await getUserByName(email);
    const userid = crypto.randomBytes(16).toString("hex");

    if(userFromDb){
      response.status(400).send({msg:"User Already Exist"})
    }else{
      const hashedPassword = await genHashedPassword(password);
      console.log(password, hashedPassword)
      const result = await CreateUser({
        name:username,                    //unique
        email:email,                  //unique
        password: hashedPassword,
        userId:userid,
        cart:[]
      });
      response.status(200).send({msg:"user created",data:result})
    }
  })

  router.post('/login', async function(request, response){          //✔️
    const {email,password} = request.body;  
    const userFromDb = await getUserByEmail(email);

    if(!userFromDb){
      response.status(400).send({msg:"Invalid Credentials or user doesnot exist"})
    }
    else{
    const storedPassword = userFromDb.password;
    const isPasswordMatch = await bcrypt.compare(password, storedPassword); 
    console.log(password,storedPassword)
    if(isPasswordMatch){
      console.log(process.env.SECRET_KEY)
      const token = jwt.sign({userId:userFromDb.userId, username:userFromDb.name}, process.env.SECRET_KEY)
      response.status(200).send({msg:"Login Successfully",token:token,userDetail:userFromDb})
      console.log(token, "from backend login")
    }else{
      response.status(400).send({msg:"Invalid Credentials"})
    }
    }
  })

//   router.post('/forgotPassword', async function(request,response){ //done
//     const { email } = request.body;
//     try {
//       if (!email) {
//         response.status(400).send({msg:"Invalid Credentials"})
//       } else {
//         if (email) {
//           const userFromDb = await getUserByName(email); 
//           const token = jwt.sign({id:userFromDb.id},process.env.SECRET_KEY,
//           //   {
//           //   expiresIn:120000
//           // }
//           ); // continue from here

//           const setuserToken = await client.db('forgotpassword').collection('users').findOneAndUpdate({email:userFromDb.email},{ $set:{verifyToken:token}},{returnDocument:"after"}); 
//           if(setuserToken){
//             var transporter = await nodemailer.createTransport({
//               service: 'gmail',
//               auth: {
//                 user: process.env.EMAIL,
//                 pass: process.env.EMAIL_PASSWORD
//               }
//             });
//             var mailOptions = {
//               from:process.env.EMAIL,
//               to:email,
//               subject:"mail to reset Password",
//               text:`This Link will be valid only once - http://localhost:3000/PasswordReset/${email}/${setuserToken.value.verifyToken}`
//             }
//             transporter.sendMail(mailOptions,(error,info) => {
//               if(error){
//                 response.status(401).send({msg:"Email Not Send"})
//               }else{
//                 response.status(201).send({msg:"Email Sent Successfully"})
//               }
//             })
//           }
          
//         }else{
//           response.status(400).send({msg:"Invalid Credentials"})
//         }
//       }

//     }catch(error){
//       response.status(400).send({msg:"Invalid Credentials"})
//     }

//   })

//   router.post("/PasswordReset/:email/:token", async function(request,response){
//     const {email,token} = request.params;
//     const {password} = request.body;
//     try{
//       const validuser = await client.db('forgotpassword').collection('users').findOne({email:email,verifyToken:token});
//       if(validuser){
//         const newhashedPassword = await genHashedPassword(password);

//         console.log(newhashedPassword,"hashed password in reset password");

//         const setnewuserPassword = await client.db('forgotpassword').collection('users').updateOne({email:email},{ $set:{password:newhashedPassword}},{ $unset: {verifyToken:1}})  
//         const removeToken = await client.db('forgotpassword').collection('users').updateOne({email:email},{ $unset: {verifyToken:1}})  
//         console.log(setnewuserPassword, removeToken)
//         response.send({
//           msg:"Success"
//         })
//       }else{
//         response.send({
//           msg:"User not exist"
//         })
//       }
//     }catch(error){
//       response.status(400).send({msg:"User not exist"})
//     }
//   })


  export default router ;