import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";
import { ACCESS_TOKEN, ROLE_USER } from "../constant";

export const AuthContext = createContext();

export default function AuthProvider({children}){
    const [token, setToken] = useState(Cookies.get(ACCESS_TOKEN));
    const [isAuth, setIsAuth] = useState(false);
    const [role, setRole] = useState(Cookies.get(ROLE_USER));
    
    useEffect(() => {
        if(token){
            setIsAuth(true);
        }
    }, [token])

    const login = (token, role) => {
        setIsAuth(true);
        setRole(role);
        setToken(token);
    }

    const logout = () => {
        setIsAuth(false);
        setRole(null);
        setToken(null);
    }

    return(
        <AuthContext.Provider 
        value={{
            token,
            isAuth,
            role,
            login,
            logout,
        }}
        >
            {children}
        </AuthContext.Provider>
    );
}