import React, { useEffect, useState } from 'react';
import {Typography, CircularProgress, Grid} from '@mui/material';
import { useParams } from 'react-router';
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import useAuth from '../../customHook/useAuth';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';

const apiUrl = import.meta.env.VITE_API_URL

const DetailsInvoice = () => {
  const {id, created_at} = useParams()
  const {token} = useAuth()
  const [dummyData, setDummyData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getInvoice()
  }, [])


  async function getInvoice(){
    setLoading(true);

    const res = await axios(
      `${apiUrl}/api/Invoice/GetInvoiceDetailsByInvoiceId/${id}`,{
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

  const ToDate2 = (date) => {
    const a = new Date(date);

    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const stringDate = a.getDate() + ' ' + month[a.getMonth()] + ' ' + a.getFullYear()  
    return stringDate;
  }

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    dummyData.forEach((item) => {
      totalPrice += item.costPerProduct;
    });
    return totalPrice;
  };


  // const data = [
  //   { id: 1, courseName: 'Tom Yum Thailand', type: 'Asian', date: 'Wednesday, 12 July 2022', totalPrice: 'IDR 250.000' },
  //   { id: 2, courseName: 'Sate Padang', type: 'Asian', date: 'Wednesday, 12 July 2022', totalPrice: 'IDR 200.000' },
  // ];

  const tableContainerStyle = {
    margin: '0 30px',
    marginBottom: '150px',
  };

  const tableStyle = {
    width: '100%',
    height: '80px',
    borderCollapse: 'collapse',
    marginBottom: '30px',
    border: 'none',
    //overflowX: 'auto',
  };

  const thStyle = {
    fontFamily: 'Montserrat Variable',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '20px',
    width: '154.67px',
    height: '20px',
    letterSpacing: '0em',
    textAlign: 'center',
    color: '#FFFFFF',
    backgroundColor: '#5B4947',
    padding: '15px',
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
    width: '154.67px',
    color: '#5B4947'
  };

  return (
    <>
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        >
        <CircularProgress color="inherit"/>
    </Backdrop>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '30px', marginBottom: '25px' }}>
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
          color: '#828282', 
          marginLeft: '5px',
        }}>
          Invoice &gt;
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
          Details Invoice
        </Typography>
      </div>
        <Typography variant="h6" component="div" style={{ fontFamily: 'Montserrat Variable', fontWeight: 600, fontSize: '20px', lineHeight: '24.38px', color: '#4F4F4F', marginBottom: '30px', marginLeft: '30px'}}>
          Details Invoice
        </Typography>
        <div style={{ marginLeft: '30px', marginBottom: '20px' }}>
        <div style={{ display: 'flex' }}>
        <Typography variant="body1" style={{ fontFamily: 'Montserrat Variable', fontSize: '18px', fontWeight: 500, lineHeight: '21.94px', letterSpacing: '0em', textAlign: 'left', color: '#5B4947', marginBottom: '10px' }}>
          No. Invoice:
        </Typography>
        <Typography variant="body1" style={{ fontFamily: 'Montserrat Variable', fontSize: '18px', fontWeight: 500, lineHeight: '21.94px', letterSpacing: '0em', textAlign: 'left', color: '#5B4947', marginBottom: '10px', marginLeft: '50px' }}>
          {id}
        </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid container>
          <Grid item lg={9} xs={12}>
          <div style={{ display: 'flex'}}>
          <Typography variant="body1" style={{ fontFamily: 'Montserrat Variable', fontSize: '18px', fontWeight: 500, lineHeight: '21.94px', letterSpacing: '0em', textAlign: 'left', color: '#5B4947', marginBottom: '10px' }}>
            Date:
          </Typography>
          <Typography variant="body1" style={{ fontFamily: 'Montserrat Variable', fontSize: '18px', fontWeight: 500, lineHeight: '21.94px', letterSpacing: '0em', textAlign: 'left', color: '#5B4947', marginBottom: '10px', marginLeft: '106px' }}>
            {ToDate2(created_at)}
          </Typography>
          </div>
          </Grid>
          <Grid item lg={3} xs={12}>
          <div style={{ display: 'flex',}}>
          <Typography variant="body1" style={{ fontFamily: 'Montserrat Variable', fontSize: '18px', fontWeight: 700, lineHeight: '21.94px', letterSpacing: '0em', textAlign: 'right', color: '#5B4947', marginBottom: '10px', marginRight: '90px', }}>
            Total Price
          </Typography>
          <Typography variant="body1" style={{ fontFamily: 'Montserrat Variable', fontSize: '18px', fontWeight: 700, lineHeight: '21.94px', letterSpacing: '0em', textAlign: 'right', color: '#5B4947', marginBottom: '10px'}}>
            IDR {Intl.NumberFormat('id').format(calculateTotalPrice())}
          </Typography>
          </div>
          </Grid>
          </Grid>
        </div>
      </div>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <div style={tableContainerStyle}>
        <TableContainer>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ fontFamily: 'Montserrat Variable', fontSize: '16px', fontWeight: 600, lineHeight: '20px', width: '60px', height: '20px', letterSpacing: '0em', textAlign: 'center', color: '#FFFFFF', backgroundColor: '#5B4947', padding: '10px', border: 'none',  }}>
                No
              </th>
              <th style={{ fontFamily: 'Montserrat Variable', fontSize: '16px', fontWeight: 600, lineHeight: '20px', width: '250px', height: '20px', letterSpacing: '0em', textAlign: 'center', color: '#FFFFFF', backgroundColor: '#5B4947', padding: '10px', border: 'none', }}>
                Course Name
              </th>
              <th style={{ ...thStyle }}>Type</th>
              <th style={{ ...thStyle }}>Schedule</th>
              <th style={{ ...thStyle }}>Price</th>
            </tr>
          </thead>
          <tbody>
          {dummyData.map((item, index) => (
              <tr key={item.id}>
                <td style={{ fontFamily: 'Montserrat Variable', fontSize: '16px', fontWeight: 600, lineHeight: '20px', width: '60px', height: '20px', letterSpacing: '0em', textAlign: 'center', color: '#5B4947', padding: '10px', border: 'none', }}>
                    {index+1}
                </td>
                <td style={{ fontFamily: 'Montserrat Variable', fontSize: '16px', fontWeight: 600, lineHeight: '20px', width: '250px', height: '20px', letterSpacing: '0em', textAlign: 'center', color: '#5B4947', padding: '10px', border: 'none', }}>
                    {item.productName}
                </td>
                <td style={{ ...tdStyle }}>{item.categoryName}</td>
                <td style={{ ...tdStyle }}>{ToDate(item.schedule)}</td>
                <td style={{ ...tdStyle }}>IDR {Intl.NumberFormat('id').format(item.costPerProduct)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </TableContainer>
        </div>
        </Paper>
    </>
  );
};

export default DetailsInvoice;
