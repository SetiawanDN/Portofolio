import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthProvider from './contexts/AuthContext.jsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <App/>
    </LocalizationProvider>
    </AuthProvider>
);
