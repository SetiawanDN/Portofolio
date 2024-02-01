import { useEffect, useState } from "react";
import { Backdrop, CircularProgress, Button, Container, Stack, TextField, Typography, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { ACCESS_TOKEN, ROLE_USER } from "./constant";
import useAuth from "./customHook/useAuth";
import { useNavigate } from "react-router";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, role } = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (role === 'user') {
            return navigate("/");
        } else if (role === 'admin') {
            return navigate("/admin/category");
        }
    }, [login]);

    const [email, setEmail] = useState("");
    const [firstEmail, setFirstEmail] = useState(true);
    const [password, setPassword] = useState("");
    const [firstPassword, setFirstPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("error");

    const validatePassword = () => {
        if (password.length < 8) {
            return "Password kurang dari 8 karakter";
        } else {
            return "";
        }
    };

    const validateEmail = () => {
        if (String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            return "";
        } else {
            return "Penulisan Email belum sesuai";
        }
    };

    const passwordError = validatePassword();
    const emailError = validateEmail();

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleSubmit = () => {
        setFirstEmail(false);
        setFirstPassword(false);
        if (passwordError || emailError) {
            //console.log('Not Submitable')
        } else {
            setLoading(true);
            axios.post(`${apiUrl}/Login`, {
                email: email,
                password: password
            }).then(function (response) {
                const tokenAfterLogin = response.data.token;
                const roleAfterLogin = response.data.role;
                Cookies.set(ACCESS_TOKEN, tokenAfterLogin, { expires: 1 });
                Cookies.set(ROLE_USER, roleAfterLogin, { expires: 1 });
                setLoading(false);
                login(tokenAfterLogin, roleAfterLogin);
            }).catch(function (error) {
                if (error.response.status === 404) {
                    setSnackbarMessage('Data tidak ditemukan, mohon periksa kembali email dan password');
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                    setLoading(false);
                }
                else if (error.response.status === 500) {
                    setSnackbarMessage('Mohon konfirmasi email anda terlebih dahulu');
                    setSnackbarSeverity('warning');
                    setSnackbarOpen(true);
                    setLoading(false);
                }
            });
        }
    };

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Container maxWidth="md">
                <Typography marginTop={5} fontSize={24} color="primary" fontWeight={500}>Welcome Back! Cheff?</Typography>
                <Typography marginBottom={5} fontSize={16} color="#4F4F4F">Please login first</Typography>
                <Stack gap={3}>
                    <TextField
                        fullWidth
                        id="email"
                        label="Email"
                        type="email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setFirstEmail(false);
                        }}
                        error={emailError === "" || firstEmail ? false : true}
                        helperText={emailError === "" || firstEmail ? "" : emailError}
                    />
                    <TextField
                        fullWidth
                        id="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setFirstPassword(false);
                        }}
                        error={passwordError === "" || firstPassword ? false : true}
                        helperText={passwordError === "" || firstPassword ? "" : passwordError}
                    />
                    <div>
                        <Typography>Forgot Password? <a onClick={() => navigate("/forgot-password")} style={{ color: "#2F80ED", textDecoration: "none", cursor: "pointer" }}>Click Here</a></Typography>
                    </div>
                    <div
                        style={{
                            marginTop: "10px",
                            textAlign: "end",
                        }}
                    >
                        <Button onClick={handleSubmit} variant="contained" color="secondary" style={{ textTransform: 'none' }} sx={{ width: 140, height: 40, borderRadius: 2 }}>Login</Button>
                    </div>
                    <div
                        style={{
                            marginTop: "10px",
                            textAlign: "center"
                        }}
                    >
                        <Typography>Don't have an account? <a onClick={() => navigate("/register")} style={{ color: "#2F80ED", textDecoration: "none", cursor: "pointer" }}>Sign Up Here</a></Typography>
                    </div>
                </Stack>
            </Container>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', backgroundColor: snackbarSeverity === 'error' ? '#ff3333' : '#d14000', color:'white', '& .MuiAlert-icon': {color: 'white'} }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default LoginPage;
