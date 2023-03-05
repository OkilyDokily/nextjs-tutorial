import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { findAvailableTables } from "../../../../services/restaurant/findAvailableTables";

const prismaClient = new PrismaClient();

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if(req.method == "POST") {
    const {slug,day,time,partySize} = req.query as {slug:string,day:string,time:string,partySize:string};

    const {bookerEmail,bookerPhone,bookerFirstName,bookerLastName, bookerOccasion,bookerRequest} = req.body;

    if(!slug || !day || !time || !partySize || !bookerEmail || !bookerPhone || !bookerFirstName || !bookerLastName ) {
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
            id: true,
        }
   
    });
    if(!restaurant) {
        res.status(400).json({errorMessage: "Invalid restaurant"});
        return;
    }
    console.log(new Date(`${day}T${time}`) );
    if(new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) || new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)) {

        res.status(400).json({errorMessage: "Invalid time"});
        return;
    }


    const searchTimesWithTables = await findAvailableTables({time,day,res,restaurant});

    if(!searchTimesWithTables) {
        res.status(400).json({errorMessage: "Missing required parameters"});
        return;
    }

    const searchTimeWithTables = searchTimesWithTables.find(t=>{
       return t.date.toISOString() === new Date(`${day}T${time}`).toISOString();
    });

    if(!searchTimeWithTables) {
        res.status(400).json({errorMessage: "No tables available at this time"});
        return;
    }

    const tablesCount:{2:number[],4:number[]} = {
        2: [],
        4: [],
    }

    searchTimeWithTables.tables.forEach(table=>{
        tablesCount[table.seats as keyof typeof tablesCount].push(table.id);
    });


    const tablesToBook:number[] = [];
    let seatsRemaining = parseInt(partySize);

    while(seatsRemaining > 0) {
        if(seatsRemaining >= 3){
            if(tablesCount[4].length > 0) {
                tablesToBook.push(tablesCount[4].shift() as number);
                seatsRemaining -= 4;
            }
            else if(tablesCount[2].length > 0){
                tablesToBook.push(tablesCount[2].shift() as number);
                seatsRemaining -= 2;
            }
        }
        else{
            if(tablesCount[2].length > 0) {
                tablesToBook.push(tablesCount[2].shift() as number);
                seatsRemaining -= 2;
            }
            else if(tablesCount[4].length > 0){
                tablesToBook.push(tablesCount[4].shift() as number);
                seatsRemaining -= 4;
            }
        }
    }

    const booking = await prismaClient.booking.create({
        data: {
            booking_time: new Date(`${day}T${time}`),
            number_of_people: parseInt(partySize),
            booker_email: bookerEmail,
            booker_phone: bookerPhone,
            booker_first_name: bookerFirstName,
            booker_last_name: bookerLastName,
            booker_occasion: bookerOccasion,
            booker_request: bookerRequest,
            restaurant_id: restaurant.id,
        }
    });

    const bookingsOnTableData = tablesToBook.map(tableId=>{
        return {
            booking_id: booking.id,
            table_id: tableId,
        }
    });

    await prismaClient.bookingsOnTables.createMany({
        data:bookingsOnTableData
    });


    res.status(200).json({booking});
}
return res.status(400).json({errorMessage: "Invalid request method"});
}