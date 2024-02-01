import '@fontsource-variable/montserrat';
import { Typography, Container, TextField, Button, Stack, Backdrop, CircularProgress, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid, useGridApiContext, useGridApiRef} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from './customHook/useAuth';

const apiUrl = import.meta.env.VITE_API_URL

const ToDate = (date) => {
  const a = new Date(date);

  const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const stringDate = day[a.getDay()] + ', ' + a.getDate() + ' ' + month[a.getMonth()] + ' ' + a.getFullYear()  
  return stringDate;
}

const columns = [
  { field: 'id_Invoice', headerName: 'ID Invoice', width: 85 },
  { field: 'id_User', headerName: 'ID User', width: 80 },
  { field: 'created_at', headerName: 'Date', width: 208 },
  { field: 'total_product', headerName: 'Total Product', width: 110 },
  { field: 'total_price', headerName: 'Total Price', width: 85 },
];

const columns2 = [
  { field: 'id', headerName: 'ID detail', width: 85 },
  { field: 'productName', headerName: 'Course', width: 150 },
  { field: 'categoryName', headerName: 'Category', width: 100 },
  { field: 'schedule', headerName: 'Schedule', width: 208, renderCell: (params) => ToDate(params.value)},
  { field: 'costPerProduct', headerName: 'Cost', width: 85 },
];

const AdminInvoice = () => {
    const {token} = useAuth()
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState(()=>[])
    const [rows2, setRows2] = useState(()=>[])
    const [selectedRow, setSelectedRow] = useState();
    
    async function GetInvoiceData(){
      setLoading(true);

      const res = await axios(
        `${apiUrl}/api/Invoice/GetInvoiceMenuAllAdmin`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const {data, status} = res

      if(status!=200) return
      setLoading(false);
      setRows(data)
    }

    async function GetInvoiceDetailsData(){
      setLoading(true);
      
      const res = await axios(
        `${apiUrl}/api/Invoice/GetInvoiceDetailsByInvoiceId/${selectedRow}`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const {data, status} = res

      if(status!=200) return
      setLoading(false);
      setRows2(data);
    }

    useEffect(()=>{
      //GetInvoiceDetailsData();
      GetInvoiceData();
    } , [])

    useEffect(()=>{
      if(selectedRow){
        GetInvoiceDetailsData()
      }
    } , [selectedRow])

    return(
        <>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit"/>
        </Backdrop>

        <Container maxWidth="md">
          {/* TABLE DATA Invoice*/}
          <Typography marginTop={1} fontSize={32} fontWeight={600} color="primary" textAlign={'center'}>
            Invoice
          </Typography>
            <DataGrid
            autoHeight
            rows={rows}
            getRowId={(row) => row.id_Invoice}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            onRowSelectionModelChange={item => {
              //console.log(item.length)
              if(item.length!=0){
                setSelectedRow(item[0])
              }
            }}
            pageSizeOptions={[5, 10]}
            />

            {/* TABLE DATA Invoice Details*/}
          <Typography marginTop={2} fontSize={24} fontWeight={500} color="primary" textAlign={'center'}>
            Invoice Details
          </Typography>
            <DataGrid
            autoHeight
            rows={rows2}
            columns={columns2}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            />

          </Container>
        </>
    )
}

export default AdminInvoice