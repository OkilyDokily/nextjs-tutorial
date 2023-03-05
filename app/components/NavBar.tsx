"use client"

import Link from "next/link";
import { useContext } from "react";
import useAuth from "../../hooks/useAuth";
import { AuthentificationContext } from "../context/AuthContext";
import AuthModal from "./AuthModal";


export default function NavBar() {
let {data,loading} = useContext(AuthentificationContext);
let {signout} = useAuth();
return(
<nav className="bg-white p-2 flex justify-between">
<Link href="/" className="font-bold text-gray-700 text-2xl">
    {" "} OpenTable{" "}
  </Link>
  <div>
    <div className="flex">
      {loading ? null : data ? <button onClick={signout}
      className="bg-blue-400 text-white p-1 px-4 rounded mr-3">Logout</button>:
      (
      <>
      <AuthModal isSignin={true}/>
      <AuthModal isSignin={false}/>
      </>)
      }
    </div>
  </div>
</nav>
)
}