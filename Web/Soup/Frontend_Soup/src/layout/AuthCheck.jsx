import { useEffect } from "react";
import useAuth from "../customHook/useAuth.js";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "../constant.js";

/* eslint-disable react/prop-types */
export default function AuthCheck({ children }) {
  const { token } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if(!token){
      return navigate("/login")
    }
  } , [])

  return (
    <>
      {children}
    </>
  );
}
