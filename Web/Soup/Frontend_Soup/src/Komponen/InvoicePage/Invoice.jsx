import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import {Typography, CircularProgress, Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import useAuth from '../../customHook/useAuth';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';

const apiUrl = import.meta.env.VITE_API_URL

const Invoice = () => {
  const {token} = useAuth()
  const navigate = useNavigate()
  const [dummyData, setDummyData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCheckout()
  }, [])

  async function getCheckout(){
    setLoading(true);

    const res = await axios(
      `${apiUrl}/api/Invoice/GetInvoiceMenuByUserId`,{
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

  const ToDate = (date) => {
    const a = new Date(date);

    const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const stringDate = day[a.getDay()] + ', ' + a.getDate() + ' ' + month[a.getMonth()] + ' ' + a.getFullYear()  
    return stringDate;
  }

  // const data = [
  //   { id: 1, noInvoice: 'SOU00003', date: '12 July 2022', totalCourse: 1, totalPrice: 'IDR 450.000' },
  //   { id: 2, noInvoice: 'SOU00002', date: '05 February 2022', totalCourse: 2, totalPrice: 'IDR 900.000' },
  //   { id: 3, noInvoice: 'SOU00001', date: '30 August 2021', totalCourse: 1, totalPrice: 'IDR 600.000' },
  // ];

  const tableContainerStyle = {
    margin: '0 30px',
    marginBottom: '150px',
  };

  const tableStyle = {
    width: '100%',
    height: '291px',
    borderCollapse: 'collapse',
    marginBottom: '30px',
    border: 'none',
  };

  const thStyle = {
    fontFamily: 'Montserrat Variable',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '20px',
    letterSpacing: '0em',
    textAlign: 'center',
    color: '#FFFFFF',
    backgroundColor: '#5B4947',
    padding: '10px',
    border: 'none', 
  };

  const tdStyle = {
    fontFamily: 'Montserrat Variable',
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '20px',
    letterSpacing: '0em',
    textAlign: 'center',
    padding: '10px',
    border: 'none',
    height: '20px',
  };

  const detailsButtonStyle = {
    width: '180px',
    height: '37px',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#FABC1D',
    cursor: 'pointer',
  };

  const detailsTextStyle = {
    fontFamily: 'Montserrat Variable',
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: '17px',
    letterSpacing: '0em',
    textAlign: 'left',
    color: '#5B4947',
  };

  return (
    <>
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        >
        <CircularProgress color="inherit"/>
    </Backdrop>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '30px', marginBottom: '20px' }}>
        <Typography variant="body1" component="div" style={{ 
          fontFamily: 'Montserrat Variable',
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: '20px',
          letterSpacing: '0em',
          textAlign: 'left',
          color: '#828282', 
        }}>
          Home &gt;
        </Typography>
        <Typography variant="body1" component="div" style={{ 
          fontFamily: 'Montserrat Variable',
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: '20px',
          letterSpacing: '0em',
          textAlign: 'left',
          color: '#5B4947',
          marginLeft: '5px',
        }}>
          Invoice
        </Typography>
      </div>
        <Typography variant="h6" component="div" style={{ width: '139px', height: '24px', fontFamily: 'Montserrat Variable', fontWeight: 600, fontSize: '20px', lineHeight: '24.38px', color: '#4F4F4F', marginBottom: '20px', marginLeft: '30px'}}>
          Menu Invoice
        </Typography>
        {dummyData.length==0 ? <Typography marginTop={15} marginBottom={30} fontSize={32} fontWeight={400} color="primary" textAlign={'center'}>No classes have been purchased yet</Typography>:
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <div style={tableContainerStyle}>
        <TableContainer>
        <Table stickyHeader sx={{ ...tableStyle}}>
          <TableHead>
            <TableRow>
              <TableCell style={{ ...thStyle }}>No</TableCell>
              <TableCell style={{ ...thStyle }}>No Invoice</TableCell>
              <TableCell style={{ ...thStyle }}>Date</TableCell>
              <TableCell style={{ ...thStyle }}>Total Course</TableCell>
              <TableCell style={{ ...thStyle }}>Total Price</TableCell>
              <TableCell style={{ ...thStyle }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell style={{ ...tdStyle }}>{index + 1}</TableCell>
                <TableCell style={{ ...tdStyle }}>{item.id}</TableCell>
                <TableCell style={{ ...tdStyle }}>{ToDate(item.created_at)}</TableCell>
                <TableCell style={{ ...tdStyle }}>{item.total_product}</TableCell>
                <TableCell style={{ ...tdStyle }}>IDR {Intl.NumberFormat('id').format(item.total_price)}</TableCell>
                <TableCell style={{ ...tdStyle }}>
                  <Button onClick={() => navigate(`/details-invoice/${item.id}/${item.created_at}`)} size="small" variant="contained" style={detailsButtonStyle}>
                    <span style={detailsTextStyle}>Details</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
      </div>
      </Paper>
    }
    </>
  );
};

export default Invoice;
