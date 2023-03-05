import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import {times} from "../../../../data/times";
import { findAvailableTables } from "../../../../services/restaurant/findAvailableTables";

const prismaClient = new PrismaClient();
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if(req.method == "GET") {
    const {slug,day,time,partySize} = req.query as {slug:string,day:string,time:string,partySize:string};
  
    if(!slug || !day || !time || !partySize) {
        res.status(400).json({errorMessage: "Missing required parameters"});
        return;
    }

    const restaurant = await prismaClient.restaurant.findUnique({
        where: {
            slug: slug
        },
        select: {
            tables: true,
            open_time: true,
            close_time: true,
        }
    });
   
    if(!restaurant) {
        res.status(400).json({errorMessage: "Invalid restaurant"});
        return;
    }

    const searchTimesWithTables = await findAvailableTables({time,day,res,restaurant});

    if(!searchTimesWithTables) {
        res.status(400).json({errorMessage: "Missing required parameters"});
        return;
    }
    for(let i = 0; i < searchTimesWithTables.length; i++) {
       console.log(searchTimesWithTables[i].tables);
    }
    const availabilities = searchTimesWithTables.map(t=>{
        const sumSeats = t.tables.reduce((sum,table)=>{
            return sum + table.seats;
        },0);
        return {
            time: t.time,
            available: sumSeats >= parseInt(partySize)
        }
    }).filter(availability=> {
        const timeIsAfterOpeningHours = new Date(`${day}T${availability.time}`).getHours() >= new Date(`${day}T${restaurant.open_time}`).getHours();
        const timeIsBeforeClosingHours = new Date(`${day}T${availability.time}`).getHours() <= new Date(`${day}T${restaurant.close_time}`).getHours();
        return timeIsAfterOpeningHours && timeIsBeforeClosingHours;
    });
    console.log(availabilities);
    return res.status(200).json({availabilities});
}
}