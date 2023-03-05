import axios from "axios";
import {removeCookies } from "cookies-next";
import { useContext } from "react";
import { AuthentificationContext } from "../app/context/AuthContext";

const useAuth = () => {
    const {setAuthState} = useContext(AuthentificationContext);
    const signin = async ({email,password}:{email:string,password:string},handleClose:()=>void) => {
        setAuthState({error:null,data:null,loading:true});
        try {
            const response = await axios.post("http://localhost:3000/api/auth/signin", { email, password });
            setAuthState({error:null,data:response.data,loading:false});
            handleClose();
        } catch (error:any) {
            setAuthState({error:error.response.data.errors[0],data:null,loading:false});      
        }

    }
    const signup = async (
            {
            email,
            password,
            firstName,
            lastName,
            city,
            phone,
            }:
            {email:
            string,
            password:string,
            firstName:string,
            lastName:string,
            city:string,
            phone:string
            },handleClose:()=>void) => {
                setAuthState({error:null,data:null,loading:true});
                try {
                    const response = await axios.post("http://localhost:3000/api/auth/signup",  {
                        email,
                        password,
                        firstName,
                        lastName,
                        city,
                        phone,
                        });
                    setAuthState({error:null,data:response.data,loading:false});
                    handleClose();
                } catch (error:any) {
                    setAuthState({error:error.response.data.errors[0],data:null,loading:false});      
                }
  
            }
   
       
    const signout = () => {
        removeCookies("jwt");
        setAuthState({error:null,data:null,loading:false});
    }


    return {
        signin,
        signup,
        signout
    }


};

export default useAuth;