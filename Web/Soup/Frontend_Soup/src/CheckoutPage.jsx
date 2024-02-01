import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { Typography, Button, Box, Grid, FormControlLabel, FormGroup, Avatar, Divider, Container, CircularProgress, useMediaQuery } from '@mui/material';
import hapus from './assets/images/hapus.png'; 
import CheckoutStyle from './Komponen/Checkout/CheckoutStyle';
import styled from '@emotion/styled';
import { AppBar, Toolbar, Alert, Snackbar } from '@mui/material';
import PaymentMethodPage from './PaymentMethodPage';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import Backdrop from '@mui/material/Backdrop';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import useAuth from './customHook/useAuth';
import zIndex from '@mui/material/styles/zIndex';
import { useTheme } from '@emotion/react';

const apiUrl = import.meta.env.VITE_API_URL

const StyledAppBar = styled(AppBar)({
  top: 'auto',
  bottom: 0,
  backgroundColor: 'white',
});

const CheckoutPage = () => {
  const {token} = useAuth()
  const [checked, setChecked] = React.useState([]);
  const [selectAll, setSelectAll] = React.useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = React.useState(false);
  const [dummyData, setDummyData] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [loading, setLoading] = useState(false)
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);


  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [overflow, SetOverflow] = useState()
  const [marginDelete, SetMarginDelete] = useState()

  useEffect(() => {
    getCart()
    getPaymentMethods()
  }, [])

  useEffect(() => {
    if(isMobile){
      SetOverflow('auto')
      SetMarginDelete('20px')
    }else{
      SetOverflow('hidden')
      SetMarginDelete('0px')
    }
  }, [isMobile])

  const [snackbarData, setSnackbarData] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  async function getCart(){
    setLoading(true);

    const res = await axios(
      `${apiUrl}/api/Cart/GetCartsByUserId`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const { data, status } = res;

    if (status != 200) return;
    setLoading(false);
    setDummyData(data);
  }
  
  async function getPaymentMethods(){
    setLoading(true);

    const res = await axios(
      `${apiUrl}/api/PaymentMethod/GetAll`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const { data, status } = res;

    if (status != 200) return;
    setLoading(false);
    setPaymentMethods(data);
  }

  const ToDate = (date) => {
    const a = new Date(date);

    const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const stringDate = day[a.getDay()] + ', ' + a.getDate() + ' ' + month[a.getMonth()] + ' ' + a.getFullYear()  
    return stringDate;
  }

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
  
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
  
    setChecked(newChecked);
    setSelectAll(newChecked.length === dummyData.length);
  };
  
  
  const handleSelectAll = () => {
    if (checked.length === dummyData.length) {
      setChecked([]);
      setSelectAll(false);
    } else {
      const allValues = dummyData.map((item) => item.id);
      setChecked(allValues);
      setSelectAll(true);
    }
  };
  
  const handleDelete = (idToDelete) => {
    setItemToDelete(idToDelete);
    setOpenConfirmationDialog(true);
  };  
  
  async function PostDeleteCart(id) {
    setLoading(true);
    axios
      .patch(`${apiUrl}/api/Cart/UpdateCartIsActivated/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        setLoading(false);
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          setSnackbarData({
            open: true,
            severity: 'error',
            message: 'Session expired, mohon login kembali',
          });
          setLoading(false);
        } else {
          setSnackbarData({
            open: true,
            severity: 'error',
            message: 'Terjadi kesalahan saat menghapus item',
          });
          setLoading(false);
        }
      });
  }

  const calculateTotalPrice = () => {
    let total = 0;
    checked.forEach((value) => {
      const selectedItem = dummyData.find((item) => item.id === value);
      if (selectedItem) {
        total += selectedItem.product.price;
      }
    });
    return total;
  };

  const handlePayNow = () => {
    if (checked.length === 0) {
      setSnackbarData({
        open: true,
        severity: 'warning',
        message: 'Anda belum memilih cart',
      });
    } else {
      setShowPaymentMethod(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarData({ ...snackbarData, open: false });
  };

  const handleClosePaymentMethod = () => {
    setShowPaymentMethod(false);
  };

  const handleCloseConfirmationDialog = () => {
  setOpenConfirmationDialog(false);
  };

  const handleDeleteConfirmed = () => {
    setOpenConfirmationDialog(false);
    const idToDelete = itemToDelete;
    const updatedData = dummyData.filter((item) => item.id !== idToDelete);
    setDummyData(updatedData);

    const newChecked = checked.filter((value) => value !== idToDelete);
    setChecked(newChecked);

    if (dummyData.length > 1) {
      setSelectAll(newChecked.length === updatedData.length);
    } else {
      setSelectAll(false);
    }

    PostDeleteCart(idToDelete);
  };
  

  return (
    <>
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        >
        <CircularProgress color="inherit"/>
    </Backdrop>
    <Box sx={CheckoutStyle.container}>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAll}
              inputProps={{ 'aria-label': 'Select all items' }}
            />
          }
          label="Pilih Semua"
        />
      </FormGroup>
      <Divider />
      {dummyData.length==0 ? 
      <Typography marginTop={5} fontSize={24} color="primary" fontWeight={500}>No item in cart</Typography> : <></>
      }
      <Box sx={{ marginBottom: '50px' }}>
        <List>
        {dummyData.map((item, index) => {
          const labelId = `checkbox-list-label-${item.id}`;

          return (
            <React.Fragment key={item.id}>
              <ListItem disablePadding sx={{overflowX:'hidden'}}>
                <ListItemButton
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    flexDirection: 'row',
                    gap: 0,
                  }}
                  role={undefined}
                  onClick={handleToggle(item.id)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(item.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <Grid container spacing={1} alignItems="center" sx={{overflowX:'visible'}}>
                  <Grid item lg={2.2} xs={12}>
                    <img width={200} height={133} alt={`Product ${item.id}`} src={`${apiUrl}/${item.product.image}`} sx={CheckoutStyle.imageStyle} />
                  </Grid>
                  <Grid item lg={9.8} xs={12} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <ListItemText
                    sx={{marginBottom: '20px', overflowX:overflow}}
                    id={labelId}
                    primary={
                      <>
                        <Typography variant="subtitle1" sx={{...CheckoutStyle.kategoriStyle, marginBottom: '4px'}}>
                          {item.categoryName}
                        </Typography>
                        <Typography variant="body1" sx={{...CheckoutStyle.namaStyle, marginBottom: '8px'}}>
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" sx={{...CheckoutStyle.tanggalStyle, marginBottom: '6px'}}>
                          Schedule: {ToDate(item.schedule)}
                        </Typography>
                        <Typography variant="body2" sx={CheckoutStyle.priceStyle}>
                          IDR {Intl.NumberFormat('id').format(item.product.price)}
                        </Typography>
                      </>
                    }
                  />
                  </Grid>
                  </Grid>
                </ListItemButton>
                <ListItemButton aria-label="delete" onClick={() => handleDelete(item.id)} sx={{marginTop: marginDelete}}>
                    <img src={hapus} alt=""/>
                 </ListItemButton>
              </ListItem>
              {index !== dummyData.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          );
        })}
      </List>
      </Box>
      <StyledAppBar position="fixed" color="primary">
        <Toolbar>
          <Grid container alignContent={'center'} alignItems={'center'}>
          <Typography variant="h6" component="div" sx={CheckoutStyle.totalPrice}>
            Total Price
          </Typography>
          <Typography variant="h6" component="div" sx={CheckoutStyle.priceAmount}>
          IDR {Intl.NumberFormat('id').format(calculateTotalPrice())}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="contained" color="secondary" sx={CheckoutStyle.buttonPay} onClick={handlePayNow}>
            Pay Now
          </Button>
          </Grid>
        </Toolbar>
      </StyledAppBar>
    </Box>
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showPaymentMethod}
      >
      <PaymentMethodPage handleClose={handleClosePaymentMethod} paymentMethods={paymentMethods} dataBayar={dummyData.filter(item => checked.includes(item.id))} />
    </Backdrop>
      <Snackbar
        open={snackbarData.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarData.severity}
          sx={{
            width: '100%',
            backgroundColor:
            snackbarData.severity === 'error' ? '#ff3333' : '#d14000',
            color: 'white',
            '& .MuiAlert-icon': {color: 'white'}
          }}
        >
          {snackbarData.message}
        </Alert>
      </Snackbar>
      
      <Dialog
        open={openConfirmationDialog}
        onClose={handleCloseConfirmationDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Yakin ingin menghapus cart ini?</DialogTitle>
        <Box sx={{ padding: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleCloseConfirmationDialog} variant="contained" color="secondary" sx={{ width: '48%',}}>
            Tidak
          </Button>
          <Box sx={{ width: '4%' }} />
          <Button onClick={handleDeleteConfirmed} variant="outlined" color="primary" sx={{ width: '48%',}}>
            Ya
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default CheckoutPage;
