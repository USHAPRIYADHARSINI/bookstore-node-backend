import express from 'express';
import { client } from '../index.js';
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'
dotenv.config();
// import nodemailer from "nodemailer";
import {auth} from '../middleware/auth.js';
import crypto from "crypto";
import { addNewBook, getAllBooks, getBookById } from '../services/books.services.js';

router.get('/',auth, async function(request, response){          //✔️

    const booksFromDb = await getAllBooks(request);
    console.log(booksFromDb);
    if(!booksFromDb){
      response.status(400).send({msg:"error in getting books"})
    }else{
      response.status(200).send(booksFromDb)
    }
  })

  router.post('/addbooks',auth, async function(request, response){          //✔️
    try{
      const data = request.body;

      const booksFromDb = await getAllBooks();
      console.log(booksFromDb);
      
        const bookToAdd = await addNewBook(data);
  
        response.status(200).send(bookToAdd)
    }catch{
      response.status(400).send({msg:"error in getting books"})
    }
   
  })

  router.get('/getbooks',auth, async function(request, response){          //✔️
    try{
      const {cart} = request.body;
      console.log(cart)
      var usercart=[]

      cart.map(async(c)=>{
        console.log(c)
        const booksFromDb = await getBookById(c);
        console.log(booksFromDb)
        if(booksFromDb){
          usercart.push(booksFromDb)
          console.log(usercart)
        }
      })
      console.log(usercart,"line no 55");
      response.status(200).send({data:usercart, msg:"success"})
    }catch{
      response.status(400).send({msg:"error in getting books"})
    }
   
  })

  
export default router ;