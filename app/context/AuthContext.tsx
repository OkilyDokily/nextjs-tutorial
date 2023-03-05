"use client"

import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useState,createContext, useEffect } from "react"

interface User{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    phone: string;
}


interface State {
    loading: boolean;
    data: User | null;
    error: string| null;
}

interface AuthState extends State{
    setAuthState: React.Dispatch<React.SetStateAction<State>>
}

export const AuthentificationContext = createContext<AuthState>({loading: false,data: null,error: null,setAuthState: () => {}});

export default function AuthContext( {children}:{children:React.ReactNode}   ){
    const [authState,setAuthState] = useState<State>({
        loading: true,
        data: null,
        error: null,
    });
    const fetchUser = async () => {
        setAuthState({error:null,data:null,loading:true});
        try {
            const jwt = getCookie("jwt");
           
            if(!jwt){
                setAuthState({error:null,data:null,loading:false});
                return;
            }
            const response = await axios.get("http://localhost:3000/api/auth/me", {headers: {Authorization: `Bearer ${jwt}`}});

            axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
         
            setAuthState({error:null,data:response.data,loading:false});
        } catch (error:any) {
            setAuthState({error:error.response.statusText,data:null,loading:false});
        }
    }
    
    useEffect(() => {
        fetchUser();
    },[])
    
    return(
        <AuthentificationContext.Provider value={{...authState,setAuthState}} >
        {children}
        </AuthentificationContext.Provider>
    )
}