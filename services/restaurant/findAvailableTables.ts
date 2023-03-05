import { PrismaClient, Table } from "@prisma/client";
import { NextApiResponse } from "next";
import { times } from "../../data";
const prismaClient = new PrismaClient();

export const findAvailableTables = async ({time,day,res,restaurant}:{time:string,day:string,res:NextApiResponse,restaurant:{
    tables: Table[];
    open_time: string;
    close_time: string;
}}) => {
    const searchTimes = times.find(t=>t.time === time)?.searchTimes;

    if(!searchTimes) {
        res.status(400).json({errorMessage: "Invalid time"});
        return;
    }

    const bookings = await prismaClient.booking.findMany({
        where: {
          booking_time: {
           gte: new Date(`${day}T${searchTimes[0]}`),
           lte: new Date(`${day}T${searchTimes[searchTimes.length-1]}`),
            },
        },
        select: {
            number_of_people: true,
            booking_time: true,
            tables: true,
        }
    });

   
    const bookingTablesObject:{[key:string]:{
        [key:number]:true
    }} = {};

    bookings.forEach(booking=>{
        let str = booking.booking_time.toISOString();
        bookingTablesObject[str] = booking.tables.reduce((obj,table)=>
        {
            return {...obj,[table.table_id]:true}
        }, bookingTablesObject[str] ? bookingTablesObject[str] : {})
    });

   
    const tables = restaurant.tables;

    const searchTimesWithTables = searchTimes.map(searchTime=>{
        return {
            date: new Date(`${day}T${searchTime}`),
            time: searchTime,
            tables: [...tables]
        }
    });

    searchTimesWithTables.forEach(t=>{
        t.tables = t.tables.filter(table=>{
            if(bookingTablesObject[t.date.toISOString()]) {
                if(bookingTablesObject[t.date.toISOString()][table.id]) {
                    return false;
                }
              
            }
            return true;
        })
    });

    return searchTimesWithTables;
}