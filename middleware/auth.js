import jwt from "jsonwebtoken";
import * as dotenv from "dotenv"
dotenv.config();

export const auth = (request,response,next) => {       //✔️
     try{
        const bearertoken = request.header("Authorization")
        console.log(request)
        console.log("bearertoken is :", bearertoken)
        if(bearertoken){
            const token = bearertoken.split(' ')[1];
            console.log(token)
            jwt.verify(token, process.env.SECRET_KEY);
            console.log({msg:"token matched"})
            next();
        }
    } catch(err){
        response.status(401).send({error:err.message, msg: "error from auth middleware"})
    }

}