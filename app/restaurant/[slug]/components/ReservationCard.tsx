"use client"
import React, { useState } from 'react'
import {partySize as partySizes,times} from "../../../../data";
import DatePicker from "react-datepicker";
import useAvailabilities from '../../../../hooks/useAvailabilities';
import { CircularProgress } from '@mui/material';
import { convertToDisplayTime } from '../../../../utils/convertToDisplayTime';
import { Time } from '../../../../utils/convertToDisplayTime';
import Link from 'next/link';

export default function ReservationCard({openTime,closeTime,slug}:{openTime:string,closeTime:string,slug:string}) {
  const [selectedDate, setSelectedDate] =useState<Date|null>(new Date());
  
  const {data,loading,error, fetchAvailabilities} = useAvailabilities();
  const [time, setTime] = useState<string>(openTime);
  const [partySize, setPartySize] = useState<number>(2);
  const [day, setDay] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const handleChangeDate = (date: Date | null) => {
    if(date) {
      //extract the day from the date
      setDay(date.toISOString().split('T')[0]);
      setSelectedDate(date);
      return;
    }
    setSelectedDate(null);
  }
  
  const handleClick = () => {
    if(selectedDate) {
      fetchAvailabilities({
        slug,
        day,
        time,
        partySize
      });
    }
  }

  const filterTimesByRestaurantOpenWindow = () => {
    const timesWithinWindow: typeof times = [];
    let isWithinWindow = false;
   
    times.forEach((t) => {
      if(t.time === openTime) {
        isWithinWindow = true;
      }
      if(isWithinWindow) {
        timesWithinWindow.push(t);
      }
      if(t.time === closeTime) {
        isWithinWindow = false;
      }
    })
    return timesWithinWindow;
  }
 
  return (
  <div className="fixed w-[25%] bottom-5 bg-white rounded p-3 shadow">
    <div className="text-center border-b pb-2 font-bold">
      <h4 className="mr-7 text-lg">Make a Reservation</h4>
    </div>
    <div className="my-3 flex flex-col">
      <label htmlFor="">Party size</label>
      <select name="" className="py-3 border-b font-light" id="" 
      value={partySize} onChange={(e)=>{setPartySize(parseInt(e.target.value))}}   
      > 
       {partySizes.map((size) => (
         <option key={size.value} value={size.value}>{size.label}</option>
        ))}
      </select>
    </div>
   
    <div className="flex justify-between">
      <div className="flex flex-col w-[48%]">
        <label htmlFor="">Date</label>
        <DatePicker
        selected={selectedDate}
        dateFormat="MMMM d"
        className='py-3 border-b font-light text-reg w-24'
        onChange={handleChangeDate}
        wrapperClassName='w-[48%]'
        />
      </div>
      <div className="flex flex-col w-[48%]">
        <label htmlFor="">Time</label>
        <select value={time} onChange={(e)=>{setTime(e.target.value)}} name="" id="" className="py-3 border-b font-light">
         {
         filterTimesByRestaurantOpenWindow().map((time) => (
            <option  value={time.time}>{time.displayTime}</option>
         ))
        }
        </select>
      </div>
    </div>
    <div className="mt-5">
      <button onClick={handleClick}
        className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
        disabled={loading}
      >
        {loading ? <CircularProgress color="inherit" /> : "Find a Time"}
      </button>
    </div>
   
    {(data && data.length) ? (
      <div className="mt-4">
        <p className="text-reg">Select a Time</p>
        <div className="flex flex-wrap mt-2">
         {
          data.map((time) => {;
            return time.available ? (
                <Link href={`/reserve/${slug}?date=${day}T${time.time}&partySize=${partySize}`}
                className="bg-red-600 cursor-pointer rounded p-2 w-28 mb-2 text-center text-white mr-2">
                  <p className="text-sm font-bold">
                    {convertToDisplayTime(time.time as Time)}
                  </p>
                </Link>      
            ) : (
             <p className='bg-gray-300 p-2 w-28 text-white mb-2 rounded mr-2'></p>
            )
          })

         }
        </div>    
      </div>
    ) : null}
  </div>
  );
}
