import { Container } from "@mui/material";
import NavBarEmpty from "../NavBarEmpty.jsx"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocation, useNavigate } from "react-router-dom";
import NavBarAdmin from "../NavBarAdmin.jsx";
import useAuth from "../customHook/useAuth.js";
import { useEffect } from "react";

/* eslint-disable react/prop-types */
export default function DefaultLayoutAdminNav({ children }) {
  const {role} = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if(role != 'admin'){
      return navigate("/")
    }
  }, [navigate])

  document.body.style = 'background: white;';
  const location = useLocation();

  const theme = createTheme({
    palette: {
      primary: {
        main: '#5B4947',
      },
      secondary: {
        main: '#FABC1D',
      },
      info: {
        main:'#4F4F4F',
      },
      warning:{
        main:'#EA9E1F',
      },
    },

    typography:{
      fontFamily: "Montserrat Variable"
    }
  });

  // set title
  document.title = "Soup " + location.pathname.replace("/", "") || "Home";
  return (
    <>
      <ThemeProvider theme={theme}>
      <NavBarAdmin>
      {children}
      </NavBarAdmin>
      </ThemeProvider>
    </>
  );
}
