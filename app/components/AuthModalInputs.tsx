import React from 'react'

interface Props{
handleChangeInputs: (e:React.ChangeEvent<HTMLInputElement>) => void;
isSignin: boolean;
inputs:
{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    city: string;
  }
}

export default function AuthModalInputs({isSignin,inputs,handleChangeInputs}:Props) {
  return (
    <div>
        {isSignin ? null :
        <div className="my-3 flex justify-between text-sm">
            <input type="text" className="border rounded py-3 p-2 w-[49%]"
            placeholder='First Name'
            value={inputs.firstName}
            name="firstName"
            onChange={handleChangeInputs}
            />
             <input type="text" className="border rounded py-3 p-2 w-[49%]"
            placeholder='Last Name'
            name="lastName"
            value={inputs.lastName}
            onChange={handleChangeInputs}
            />
        </div>
        }
        <div className="my-3 flex justify-between text-sm">
        <input type="email" className="border rounded py-3 p-2 w-full"
            placeholder='Email'
            name="email"
            value={inputs.email}
            onChange={handleChangeInputs}
            />
        </div>
        {isSignin ? null :
        <div className="my-3 flex justify-between text-sm">
            <input type="text" className="border rounded py-3 p-2 w-[49%]"
            placeholder='Phone'
            name="phone"
            value={inputs.phone}
            onChange={handleChangeInputs}
            />
             <input type="text" className="border rounded py-3 p-2 w-[49%]"
            placeholder='City'
            name="city"
            value={inputs.city}
            onChange={handleChangeInputs}
            />
        </div>
        }
        <div className="my-3 flex justify-between text-sm">
        <input type="password" className="border rounded py-3 p-2 w-full"
            placeholder='Password'
            name="password"
            value={inputs.password}
            onChange={handleChangeInputs}
            />
        </div>
    </div>
  )
}
