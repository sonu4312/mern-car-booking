import express, {Request,Response} from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

// /api/users/register
router.post(
    "/register", 
    [
        // For the validation of name ,email and passwords 
    check("firstName","First Name is required").isString(),
    check("lastName","Last Name is requied").isString(),
    check("email","Email is required").isEmail(),
    check("password","Password with 6 or more characters required").isLength({
        min:6,
    }),
],
 async (req: Request, res: Response)=>{
    //giving message as array if any validation check results
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({message: errors.array()})
    }

    try{
        let user  = await User.findOne({
            email : req.body.email,         //Checking whether the email is new email or existing one by creating a object of email as "user"
        });

        if(user){
            return res.status(400).json({message: "User already exists"});
        }

        user = new User(req.body)
        await user.save();

        const token = jwt.sign(
            {userId: user.id}, 
            process.env.JWT_SECRET_KEY as string,
           { 
            expiresIn: "1d"
            }
        );

        res.cookie("auth_token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            maxAge : 86400000,
        })
        return res.status(200).send({ message: "User regitstered OK" });
    } catch(error){
        console.log(error);
        res.status(500).send({message: "Something went wrong"});
    }
});

export default router;