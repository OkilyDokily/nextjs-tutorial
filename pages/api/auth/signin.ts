import { NextApiRequest, NextApiResponse } from "next/types";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { PrismaClient } from "@prisma/client";
import validator from "validator";
import {setCookie} from "cookies-next"

const prismaClient = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST"){
        const errors: string[] = [];
        const {email, password} = req.body;

        const validationSchema = [
            {
                valid: validator.isEmail(email),
                errorMessage: "Invalid email"
            },
            {
                valid: validator.isLength(password, {min: 1}),
                errorMessage: "Password is required"
            }
        ];

        validationSchema.forEach((item) => {
            if(!item.valid){
                errors.push(item.errorMessage);
            }
        });

        if(errors.length > 0){
            return res.status(400).json({errors});
        }
            
        const user = await prismaClient.user.findUnique({
            where: {
                email
            }
        });
        
        if(user){
            const isValid = await bcrypt.compare(password, user.password);
            if(isValid){
                const alg = 'HS256';
                const secret = new TextEncoder().encode(process.env.JWT_SECRET);
                
                const token = await new jose.SignJWT({ email: user.email })
                .setProtectedHeader({ alg }).setExpirationTime('96h')
                .sign(secret);
                setCookie("jwt",token, {req,res, maxAge: 60 * 60 * 24 * 7,});

                return res.status(200).json({firstName: user.first_name, lastName: user.last_name, email: user.email, phone: user.phone, city: user.city});
            }
        }
        else{

        return res.status(401).json({errors: ["Invalid credentials"]});
        }
    }
    return res.status(404).json({message: "Not found"});
}


