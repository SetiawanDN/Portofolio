import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router";

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {Backdrop, CircularProgress, Snackbar, useMediaQuery } from '@mui/material';

import MuiAlert from '@mui/material/Alert';
import useAuth from './customHook/useAuth';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import { useTheme } from '@emotion/react';

const imageStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '8px',
};

const textItemStyle = {
  width: '270px',
  height: '20px',
  fontFamily: 'Poppins',
  fontSize: '18px',
  fontWeight: 500,
  lineHeight: '20px',
  letterSpacing: '0em',
  textAlign: 'left',
  color: '#000000'
};

const apiUrl = import.meta.env.VITE_API_URL

const PaymentMethodPage = ({handleClose, paymentMethods, dataBayar, isBuyNow, id_product, schedule}) => {
  const {token} = useAuth()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [width, setWidth] = useState()
  const [textAlignTitle, setTextAlignTitle] = useState()
  const [fontSizeButton, setFontSizeButton] = useState()

  useEffect(()=>{
    if(isMobile){
      setWidth(300)
      setTextAlignTitle('left')
      setFontSizeButton('13.7px')
    }else{
      setWidth(400)
      setTextAlignTitle('center')
      setFontSizeButton('16px')
    }
  }, [isMobile])

  const handlePaymentSelection = (payment) => {
    setSelectedPayment(payment);
  };

  const handleCancel = () => {
    setSelectedPayment(null);
    handleClose();
  };

  const handlePayNow = () => {
    if (!selectedPayment) {
      setSnackbarMessage('Anda belum memilih metode pembayaran');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
    } else if (isBuyNow) {
      setLoading(true)
      axios.post(`${apiUrl}/api/Invoice/BuyNow`, {
        fk_id_payment_method: selectedPayment,
        fk_id_product: id_product,
        schedule: schedule
      }, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      }).then(function (response) {
        navigate('/successfull')
        setLoading(false);
      }).catch(function (error) {
        if(error.response.status===401){
          setSnackbarMessage('Session expired, mohon login kembali');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setLoading(false)
        }
        if(error.response.status===500){
          setSnackbarMessage('Anda mencoba membeli kelas yang sudah ada di cart atau yang sudah anda beli');
          setSnackbarSeverity('warning');
          setSnackbarOpen(true);
          setLoading(false)
        }
      });
    } else {
      setLoading(true)
      axios.post(`${apiUrl}/api/Invoice/Create`, {
        fk_id_payment_method: selectedPayment,
        carts: dataBayar
      }, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      }).then(function (response) {
        navigate('/successfull')
        setLoading(false);
      }).catch(function (error) {
        if(error.response.status===401){
          setSnackbarMessage('Session expired, mohon login kembali');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setLoading(false)
        }
      });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
    >
      <CircularProgress color="inherit"/>
    </Backdrop>
    <Box sx={{
      width: width,
      padding: 5,
      borderRadius: 2,
      bgcolor: '#FFFFFF',
    }}>
      <Typography
        variant="h6"
        sx={{
          width: '326px',
          height: '30px',
          fontSize: '20px',
          fontWeight: 500,
          lineHeight: '30px',
          letterSpacing: '0em',
          textAlign: textAlignTitle,
          color: '#41454D',
        }}
      >
        Select Payment Method
      </Typography>
      <nav aria-label="payment methods">
        <List>
          { paymentMethods ? paymentMethods.map((item, index) => 
            <ListItem key={item.id} disablePadding selected={selectedPayment === item.id}>
              <ListItemButton onClick={() => handlePaymentSelection(item.id)}>
                <ListItemIcon>
                  <img
                    src={`${apiUrl}/${item.image}`}
                    alt={item.name}
                    style={imageStyle}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  sx={textItemStyle}
                />
              </ListItemButton>
            </ListItem>
          ) : <></>}
        </List>
      </nav>
      <Stack spacing={4} direction="row" alignItems={'center'} marginTop={2}>
      <Button
        variant="outlined"
        color="primary"
        sx={{
          width: '130px',
          height: '48px',
          borderRadius: '8px',
          border: '1px solid',  
          fontSize: fontSizeButton,
          fontWeight: 600,
          textTransform: 'none'
        }}
        onClick={handleCancel}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        color="secondary"
        sx={{
          width: '130px',
          height: '48px',
          borderRadius: '8px',
          fontSize: fontSizeButton,
          fontWeight: 600,
          textAlign: 'center',
          textTransform: 'none'
        }}
        onClick={handlePayNow}
      >
        Pay Now
      </Button>
      </Stack>
    </Box>
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        sx={{ width: '100%', backgroundColor: snackbarSeverity === 'error' ? '#ff3333' : '#d14000', color:'white', '& .MuiAlert-icon': {color: 'white'} }}
      >
        {snackbarMessage}
      </MuiAlert>
    </Snackbar>
    </>
  );
}

export default PaymentMethodPage
