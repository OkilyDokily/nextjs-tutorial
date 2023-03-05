"use client"

import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AuthModalInputs from './AuthModalInputs';
import { useEffect, useState,useContext } from 'react';
import useAuth from '../../hooks/useAuth';
import { AuthentificationContext } from '../context/AuthContext';
import { Alert, CircularProgress } from '@mui/material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function AuthModal({isSignin}:{isSignin:boolean}) {
 
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const {signin,signup} = useAuth();
  const {loading,data,error} = useContext(AuthentificationContext);

  const renderContent = (singinContent:string,singup:string) => {
        return isSignin ? singinContent : singup;
    }

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    city: "",
  });

  const handleChangeInputs = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name,value} = e.target;
    setInputs({...inputs,[name]:value});
  }

  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    if(isSignin){
      if(inputs.email && inputs.password){
        setDisabled(false);
      }else{
        setDisabled(true);
      }
    }else{
      if(inputs.firstName && inputs.lastName && inputs.email && inputs.password && inputs.phone && inputs.city){
        setDisabled(false);
      }else{
        setDisabled(true);
      }
    }
  }, [inputs]);
 
  const handleClick = () => {
    if (isSignin) {
      signin({ email: inputs.email, password: inputs.password },handleClose);
    } else {
      signup({ ...inputs },handleClose);
    }
  };

  return (
    <div>
       <button onClick={handleOpen}
        className={`${renderContent("bg-blue-400 text-white", "")} border p-1 px-4 rounded mr-3`}>
        {renderContent("Sign in","Sign up")}
      </button>
      <Modal 
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
     <Box sx={style}>
     {loading ? 
        (<div className='p-2 h-[600px] flex justify-center'>
        <CircularProgress/>
        </div>) :
        (<div className="p-2 h-[600px]">
          {(error ? 
          (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>) 
          : null)}
          <div className="upper-case font-bold text-center pb-2 border-b mb-2">
            <p className="text-sm">
                {renderContent("Sign in","Create Account")}
            </p>
          </div>
          <div className="m-auto">
            <h2 className="text-2xl font-light text-center">
                {renderContent("Log into your acccount","Create your OpenTable account")}
            </h2>
            <AuthModalInputs isSignin={isSignin} inputs={inputs} handleChangeInputs={handleChangeInputs} />
            <button 
            onClick={handleClick}
            disabled={disabled} 
            className='uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400'>
                {renderContent("Sign in","Create account")}
            </button>
          </div>
        </div>) }
        </Box> 
      </Modal>
    </div>
   
  );
}