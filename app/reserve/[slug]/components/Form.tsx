"use client"

import { CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { partySize } from '../../../../data';
import useReservation from '../../../../hooks/useReservation';

export default function Form({slug,partySize,date}: {slug: string,partySize: string,date: string}) {
  const [day,time] = date.split("T");
  const [didBook, setDidBook] = useState(false);
  const [inputs, setInputs] = useState({
    bookerFirstName: '',
    bookerLastName: '',
    bookerPhone: '',
    bookerEmail: '',
    bookerOccasion: '',
    bookerRequest: '',
  });

  useEffect(() => {
    if(inputs.bookerFirstName && inputs.bookerLastName && inputs.bookerPhone && inputs.bookerEmail){
        setDisabled(false);
    }else{
        setDisabled(true);
    }
    
  }, [inputs]);

  const handleChangeInputs = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name,value} = e.target;
    setInputs({...inputs,[name]:value});
  }

  const handleClick = async () => {
    const booking = await createReservation({
      slug,
      partySize,
      time,
      day,
      setDidBook,
      ...inputs
  });
  }


  const [disabled, setDisabled] = useState(true);
  const {loading,error,createReservation} = useReservation();
  return (
    <div className="mt-10 flex flex-wrap justify-between w-[660px]">
    {didBook ? 
    <div>
      <h1>You are all booked up</h1>
      <p>Thank you for your reservation. We look forward to seeing you soon.</p>
    </div> : <><input
      type="text"
      className="border rounded p-3 w-80 mb-4"
      placeholder="First name"
      name="bookerFirstName"
      value={inputs.bookerFirstName}
      onChange={handleChangeInputs}
    />
    <input
      type="text"
      className="border rounded p-3 w-80 mb-4"
      placeholder="Last name"
      name="bookerLastName"
      value={inputs.bookerLastName}
      onChange={handleChangeInputs}
    />
    <input
      type="text"
      className="border rounded p-3 w-80 mb-4"
      placeholder="Phone number"
      name="bookerPhone"
      value={inputs.bookerPhone}
      onChange={handleChangeInputs}
    />
    <input
      type="text"
      className="border rounded p-3 w-80 mb-4"
      placeholder="Email"
      name="bookerEmail"
      value={inputs.bookerEmail}
      onChange={handleChangeInputs}
    />
    <input
      type="text"
      className="border rounded p-3 w-80 mb-4"
      placeholder="Occasion (optional)"
      name="bookerOccasion"
      value={inputs.bookerOccasion}
      onChange={handleChangeInputs}
    />
    <input
      type="text"
      className="border rounded p-3 w-80 mb-4"
      placeholder="Requests (optional)"
      name="bookerRequest"
      value={inputs.bookerRequest}
      onChange={handleChangeInputs}
    />
    <button disabled={disabled || loading}
      onClick={handleClick}
      className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
    >
      {loading ?  <CircularProgress color="inherit"/> :"Complete reservation"}
    </button>
    <p className="mt-4 text-sm">
      By clicking “Complete reservation” you agree to the OpenTable Terms
      of Use and Privacy Policy. Standard text message rates may apply.
      You may opt out of receiving text messages at any time.
    </p>
    </>
}
  </div>
  )
}
