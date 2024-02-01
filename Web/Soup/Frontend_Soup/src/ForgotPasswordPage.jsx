import { useEffect, useState } from "react";
import { Backdrop, CircularProgress, Button, Container, Stack, TextField, Typography, Snackbar, Alert } from "@mui/material";
import '@fontsource-variable/montserrat';
import { useNavigate } from "react-router";
import axios from "axios";
import useAuth from "./customHook/useAuth";

const ForgotPasswordPage = () => {
    const { role } = useAuth();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (role === 'user') {
            return navigate("/");
        } else if (role === 'admin') {
            return navigate("/admin/category");
        }
    }, []);

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleSubmit = () => {
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
        } else {
            setLoading(true);
            setEmailError('');
            axios.patch(`${apiUrl}/RequestResetPassword`, {
                email: email
            }).then(function (response) {
                setLoading(false);
                setSnackbarMessage("Silahkan membuka email anda untuk mengganti password");
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
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Container maxWidth="md">
                <Typography fontSize={24} color="#0" fontWeight={500}>Reset Password</Typography>
                <Typography fontSize={16} color="#0">Send OTP code to your email address</Typography>
                <Stack spacing={3} marginTop={3}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={emailError !== ''}
                        helperText={emailError}
                    />
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button onClick={() => navigate("/login")} variant="outlined" color="primary">Cancel</Button>
                        <Button variant="contained" color="warning" onClick={handleSubmit}>Confirm</Button>
                    </Stack>
                </Stack>
            </Container>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', backgroundColor: snackbarSeverity === 'error' ? '#ff3333' : '#008000', color:'white', '& .MuiAlert-icon': {color: 'white'} }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ForgotPasswordPage;
