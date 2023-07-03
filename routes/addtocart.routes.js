import express from 'express';
import { client } from '../index.js';
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'
dotenv.config();
import {auth} from '../middleware/auth.js';
import {AddToCart, getAllFromCart } from '../services/addtocart.services.js';
import { getUserById } from '../services/user.services.js';

router.get('/:userid', async function(request, response){          //✔️
    
    const { userid } = request.params;
    const userFromDb = await getAllFromCart(userid);
    console.log(userFromDb);
    if(!userFromDb){
      response.status(200).send({msg:"no items in your cart"})
    }else{
      response.status(200).send(userFromDb)
    }
  })


  router.put('/additemstocart/:userid',auth , async function(request, response){          

    const { userid } = request.params;
    const modifycart = request.body;
    console.log(modifycart, userid);

    let userFromDb = await  getUserById(userid);
    if(userFromDb){
      console.log(modifycart)
      const result = await AddToCart({modifycart},{userid})
      const res = await getAllFromCart(userid)
      response.status(200).send({data:res.cart,msg:"success"})
    }else{
      response.status(400).send({msg:"no user found"})
    }
  })

export default router ;