import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import bcrypt from 'bcrypt';
import * as jose from 'jose';
import { setCookie } from 'cookies-next';

const prismaClient = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
    const {
        firstName
        , lastName
        , email
        , password
        , phone
        ,city
    } = req.body;

    const userWithEmail = await prismaClient.user.findUnique({
        where: {
            email
        }
    });

    const hashedPassword = await bcrypt.hash(password, 12);

    if(userWithEmail){
        return res.status(400).json({ errors: ['Email already in use'] });
    }

    const errors: string[] = [];
    const validationSchema = [
        {
            valid: validator.isLength(firstName, { min: 2, max: 20 }),
            errorMessage: 'First name must be between 2 and 20 characters',
        },
        {
            valid: validator.isLength(lastName, { min: 2, max: 20 }),
            errorMessage: 'Last name must be between 2 and 20 characters',
        },
        {
            valid: validator.isEmail(email),
            errorMessage: 'Invalid email',
        },
        {
            valid: validator.isMobilePhone(phone),
            errorMessage: 'Invalid phone number',
        },
        {
            valid: validator.isLength(city, { min: 2, max: 20 }),
            errorMessage: 'City must be between 2 and 20 characters',
        },
        //validate password is strong
        {
            valid: validator.isStrongPassword(password),
            errorMessage: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        },  
];
        validationSchema.forEach((item) => {
            if (!item.valid) {
            errors.push(item.errorMessage);
            }
        });
        if(errors.length > 0) {
            return res.status(400).json({ errors });
        }

    const user = await prismaClient.user.create({
        data: {
            first_name:firstName,
            last_name:lastName
            , email
            , password: hashedPassword
            , phone
            ,city
        }
    });
    const alg = 'HS256';
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({ email: user.email })
    .setProtectedHeader({ alg }).setExpirationTime('96h')
    .sign(secret);
    setCookie("jwt",token, {req,res, maxAge: 60 * 60 * 24 * 7,});

    res.status(200).json({firstName: user.first_name, lastName: user.last_name, email: user.email, phone: user.phone, city: user.city}) ;
    } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    }
};