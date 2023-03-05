import {Dispatch, SetStateAction, useState} from 'react';
import axios from 'axios';

export default function useReservation(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createReservation = async (
        {
        slug,day,time,partySize,
        bookerEmail,bookerPhone,bookerFirstName,bookerLastName, bookerOccasion,bookerRequest,setDidBook
        }
    : {
        slug:string,day:string,time:string,
        bookerEmail:string,bookerPhone:string,bookerFirstName:string,bookerLastName:string, bookerOccasion:string,bookerRequest:string,
        partySize:string,
        setDidBook:Dispatch<SetStateAction<boolean>>
        }
        ) => {
        setLoading(true);
        try {
            const response = await axios.post(`/api/restaurant/${slug}/reserve`,{
                bookerEmail,bookerPhone,bookerFirstName,bookerLastName, bookerOccasion,bookerRequest
            },{
                params: {
                    day,
                    time,
                    partySize,
                }
            });
            setLoading(false);
            setDidBook(true)
            return response.data;
        } catch (error:any) {
            setLoading(false);
            setError(error.response.data.errorMessage);
        }
    }
    return {loading,error,createReservation};
}