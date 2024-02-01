import { useState } from "react";
import { Backdrop, CircularProgress, Button, Container, Stack, TextField, Typography, Snackbar, Alert } from "@mui/material";
import '@fontsource-variable/montserrat';
import { useNavigate, useParams } from "react-router";
import axios from "axios";

const NewPasswordPage = () => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = useParams();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleSubmit = () => {
        if (password !== confirmPassword) {
            setPasswordError('Wrong Passwords');
        } else {
            setLoading(true);
            setPasswordError('');

            axios.patch(`${apiUrl}/ChangePassword`, {
                token: token.token,
                password: password
            }).then(function (response) {
                setLoading(false);
                setSnackbarMessage("Penggantian password berhasil");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
                navigate('/login');
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
                <Typography variant="h4" fontWeight={500}>Create Password</Typography>
                <Stack spacing={3} marginTop={3}>
                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        variant="outlined"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={passwordError !== ''}
                        helperText={passwordError}
                    />
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button variant="outlined" color="primary" onClick={() => navigate("/forgot-password")}>Cancel</Button>
                        <Button variant="contained" color="warning" onClick={handleSubmit}>Submit</Button>
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

export default NewPasswordPage;
