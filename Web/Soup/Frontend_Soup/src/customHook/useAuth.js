import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function useAuth(){
    const { token, isAuth, role, login, logout} = useContext(AuthContext);
    
    return{
        token,
        isAuth,
        role,
        login,
        logout
    }
}