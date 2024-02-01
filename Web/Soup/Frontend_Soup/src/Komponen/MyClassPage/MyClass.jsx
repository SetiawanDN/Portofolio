import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Grid from '@mui/material/Grid';
import {Typography, CircularProgress} from '@mui/material';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import useAuth from '../../customHook/useAuth';

const apiUrl = import.meta.env.VITE_API_URL

// const data = [
//   {
//     id: 1,
//     image: 'https://tse4.mm.bing.net/th?id=OIP.ycAMkwAbwnemCpmLqv31WAAAAA&pid=Api&P=0&h=220',
//     category: 'Asian',
//     name: 'Arc Skypie',
//     checkoutDate: 'Saturday, 9 December 2023',
//   },
//   {
//     id: 2,
//     image: 'https://tse2.mm.bing.net/th?id=OIP.VmKIvYhjgRqeHUn9vntY4wAAAA&pid=Api&P=0&h=220',
//     category: 'Eastern',
//     name: 'Flashback ASL',
//     checkoutDate: 'Sunday, 24 July 2023',
//   },
// ];

//test

const MyClass = () => {
  const {token} = useAuth()
  const [dummyData, setDummyData] = useState([])
  const [loading, setLoading] = useState(false)
  const [marginBottomToFooter, setMarginBottomToFooter] = useState('100px')

  useEffect(() => {
    getPaidClass()
  }, [])

  async function getPaidClass(){
    setLoading(true);

    const res = await axios(
      `${apiUrl}/api/Invoice/GetPaidProductsByUserId`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const { data, status } = res;

    if (status != 200) return;
    setLoading(false);
    setDummyData(data);
    if(data.length<2){
      setMarginBottomToFooter('300px')
    }else{
      setMarginBottomToFooter('100px')
    }
  }

  const ToDate = (date) => {
    const a = new Date(date);

    const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const stringDate = day[a.getDay()] + ', ' + a.getDate() + ' ' + month[a.getMonth()] + ' ' + a.getFullYear()  
    return stringDate;
  }



  return (
    <>
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        >
        <CircularProgress color="inherit"/>
    </Backdrop>
    <Box sx={{ width: '100%', bgcolor: 'background.paper', marginBottom: marginBottomToFooter }}>
    {dummyData.length==0 ? <Typography marginTop={20} marginBottom={30} fontSize={32} fontWeight={400} color="primary" textAlign={'center'}>No classes have been purchased yet</Typography>:
      <List>
        {dummyData.map((item) => (
          <div key={item.id}>
            <ListItem disablePadding sx={{ paddingLeft: '25px', paddingRight: '25px' }}>
              <ListItemButton>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={12} lg={2.2}>
                    <img
                      src={`${apiUrl}/${item.image}`} 
                      alt={""}
                      style={{
                        width: '200px',
                        height: '133.33px',
                        border: '1px solid #000',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} lg={9.8} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily: 'Montserrat Variable',
                        fontSize: '16px',
                        fontWeight: 400,
                        color: '#828282',
                        marginBottom: '4px',
                      }}
                    >
                      {item.category}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: 'Montserrat Variable',
                        fontSize: '24px',
                        fontWeight: 600,
                        color: '#333333',
                        marginBottom: '4px',
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'Montserrat Variable',
                        fontSize: '20px',
                        fontWeight: 500,
                        color: '#FABC1D',
                        marginBottom: '20px'
                      }}
                    >
                      Schedule: {ToDate(item.schedule)}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItemButton>
            </ListItem>
            <Divider sx={{ paddingLeft: '25px', paddingRight: '25px', position: 'center' }} />
          </div>
        ))}
      </List>
      }
    </Box>
    </>
  );
}

export default MyClass;
