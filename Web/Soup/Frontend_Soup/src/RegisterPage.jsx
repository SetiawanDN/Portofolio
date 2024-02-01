import { useEffect, useState } from "react";
import { Backdrop, CircularProgress, Button, Container, Stack, TextField, Typography, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import useAuth from "./customHook/useAuth";
import { useNavigate } from "react-router";

const RegisterPage = () => {
    const { role } = useAuth();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const [name, setName] = useState("");
    const [firstName, setFirstName] = useState(true);
    const [email, setEmail] = useState("");
    const [firstEmail, setFirstEmail] = useState(true);
    const [password, setPassword] = useState("");
    const [firstPassword, setFirstPassword] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstConfirmPassword, setFirstConfirmPassword] = useState(true);
    const [loading, setLoading] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    useEffect(() => {
        if (role === 'user') {
            return navigate("/");
        } else if (role === 'admin') {
            return navigate("/admin/category");
        }
    }, []);

    const validateName = () => {
        if (String(name).match(/^[a-zA-Z_]+( [a-zA-Z_]+)*$/)) {
            return "";
        } else {
            return "Penulisan nama belum sesuai";
        }
    };

    const validatePassword = () => {
        if (password.length < 8) {
            return "Password kurang dari 8 karakter";
        } else {
            return "";
        }
    };

    const validateConfirmPassword = () => {
        if (confirmPassword !== password) {
            return "Konfirmasi password belum sesuai";
        } else {
            return "";
        }
    };

    const validateEmail = () => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
        if (email.toLowerCase().endsWith('@gmail.com') && email.match(emailRegex)) {
            return "";
        } else {
            return "Penulisan Email belum sesuai";
        }
    };

    const nameError = validateName();
    const passwordError = validatePassword();
    const confirmPaswordError = validateConfirmPassword();
    const emailError = validateEmail();

    const handleSubmit = () => {
        setFirstEmail(false);
        setFirstPassword(false);
        setFirstConfirmPassword(false);
        setFirstName(false);

        if (passwordError || emailError || nameError || confirmPaswordError) {
            console.log('Not Submitable');
        } else {
            console.log('Submitable');
            setLoading(true);
            
            axios.post(`${apiUrl}/RegisterUser`, {
                name: name,
                email: email,
                password: password
            }).then(function (response) {
                setLoading(false);
                setSnackbarMessage("Registrasi berhasil, silahkan konfirmasi email anda");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            }).catch(function (error) {
                setLoading(false);
                setSnackbarMessage(error.response.data.detail);
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
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
                <Typography marginTop={5} fontSize={24} color="primary" fontWeight={500}>Are you ready become a professional chef?</Typography>
                <Typography marginBottom={5} fontSize={16} color="#4F4F4F">Please register first</Typography>
                <Stack gap={3}>
                    <TextField
                        fullWidth
                        id="outlined-basic-name"
                        label="Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setFirstName(false);
                        }}
                        error={nameError === "" || firstName ? false : true}
                        helperText={nameError === "" || firstName ? "" : nameError}
                    />
                    <TextField
                        fullWidth
                        id="outlined-basic-email"
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
                        id="outlined-basic-password"
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
                    <TextField
                        fullWidth
                        id="outlined-basic-confirm-password"
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setFirstConfirmPassword(false);
                        }}
                        error={confirmPaswordError === "" || firstConfirmPassword ? false : true}
                        helperText={confirmPaswordError === "" || firstConfirmPassword ? "" : confirmPaswordError}
                    />
                    <div
                        style={{
                            marginTop: "10px",
                            textAlign: "end",
                        }}
                    >
                        <Button onClick={handleSubmit} variant="contained" color="secondary" style={{ textTransform: 'none' }} sx={{ width: 140, height: 40, borderRadius: 2 }}>Sign Up</Button>
                    </div>
                    <div
                        style={{
                            marginTop: "10px",
                            textAlign: "center"
                        }}
                    >
                        <Typography>Have an account? <a onClick={() => navigate("/login")} style={{ color: "#2F80ED", textDecoration: "none", cursor: "pointer" }}>Login here</a></Typography>
                    </div>
                </Stack>
            </Container>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%', backgroundColor: snackbarSeverity === 'error' ? '#ff3333' : '#008000', color: 'white', '& .MuiAlert-icon': { color: 'white' } }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default RegisterPage;
