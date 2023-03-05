import { NextApiRequest, NextApiResponse } from "next/types";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const bearerToken = req.headers.authorization as string;
    if(!bearerToken){
        return res.status(401).json({message: "Unauthorized"});
    }

    const token = bearerToken.split(" ")[1];
  
    const payload = jwt.decode(token) as {email: string};

    if(!payload.email){
        return res.status(401).json({message: "Unauthorized"});
    }

    const user = await prismaClient.user.findUnique({
        where: {
            email: payload.email
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
            city: true,
        }

    });
  
    if(!user){
        return res.status(401).json({errorMessage: "User not found"});
    }
    
    return res.status(200).json({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        city: user.city
    });
}
