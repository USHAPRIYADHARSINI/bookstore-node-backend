import express from 'express';
import { client } from '../index.js';
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'
dotenv.config();
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

const storeItems = new Map([
  [1, { priceInCents: 10000, name: "Learn React Today" }],
  [2, { priceInCents: 20000, name: "Learn CSS Today" }],
])

router.post("/create-checkout-session", async (req, res) => {
  try {
    console.log("backend started")
    console.log(req.body)
    const cart = req.body
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cart.map(item => {
        // const storeItem = storeItems.get(item.id)
        const price1 = +(item.price.split("$")[1]) * 100
        console.log(price1, typeof(price1))
        const price = Math.floor(price1)
        console.log(price, typeof(price));
        return {
          price_data: {
            currency: "inr",
            product_data: {
              // name: storeItem.name,
              name: item.title,
            },
            // unit_amount: storeItem.priceInCents,
            unit_amount: price,
          },
          // quantity: item.quantity,
          quantity: 1,
        }
      }),
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    })
    res.json({ url: session.url })
    console.log("backend ended")
  } catch (e) {
    console.log("backend catch")
    res.status(500).json({ error: e.message })
  }
})

export default router ;