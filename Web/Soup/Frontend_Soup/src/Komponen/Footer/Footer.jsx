// src/components/Footer.jsx
import { Grid, Container, Stack, CircularProgress, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import Box from '@mui/system/Box';
import FooterStyle from './FooterStyle'; // Mengimpor komponen FooterStyle

import phone from '../../assets/images/phone.png'
import ig from '../../assets/images/ig.png'
import yutub from '../../assets/images/yutub.png'
import tele from '../../assets/images/tele.png'
import email from '../../assets/images/email.png'
import { useNavigate } from 'react-router';
import useGetItemList2 from '../../customHook/useGetItemList2';
import { Link } from 'react-router-dom';
import { useTheme } from '@emotion/react';

const Footer = () => {
  const navigate = useNavigate();
  const {loading, itemData2} = useGetItemList2();
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

 return (
        <Box sx={{width: '100%', height: 'auto', bgcolor: 'primary.main',}} paddingBottom={5}>
          <Grid container spacing={3} paddingX={10}>
            <Grid item lg={4} md={12}>
              <h2 style={FooterStyle.title}>About Us</h2>
                <p style={FooterStyle.content}>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
            </Grid>
            <Grid item lg={4} md={6} xs={12}>
              <h2 style={FooterStyle.title}>Product</h2>
              {loading ? 
              <div style={{display:"flex", justifyContent:"center", alignItems:"center", marginBottom:50}}>
              <p style={FooterStyle.content}>
                  loading...
              </p>
              </div> :
              <Grid container spacing={1}>
                {itemData2.map((item, key) => (
                <Grid key={key} item xs={6} sm={6}>
                <ul style={FooterStyle.content}>
                  <li key={key} style={{cursor: "pointer"}}>
                    <Link reloadDocument to={`/menu-list/${item.id}`} style={{ textDecoration: 'none' }}>
                      <Typography color="#FFFFFF" fontSize={14} fontWeight={400}>{item.name}</Typography>
                    </Link>
                  </li>
                </ul>
                </Grid>
                ))}
              </Grid>
              }
            </Grid>
            <Grid item lg={4} md={12} xs={12}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                <h2 style={FooterStyle.title}>Address</h2>
                <p style={FooterStyle.content}>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque.
                </p>
                </Grid>
                <Grid container spacing={1}>
                <Grid item xs={12}>
                <h2 style={FooterStyle.title}>Contact Us</h2>
                
                {isMobile ? 
                  <Grid container spacing={1}>
                  <Grid item xs={4}>
                  <img src={phone} alt="" />
                  </Grid>
                  <Grid item xs={4}>
                  <img src={ig} alt="" />
                  </Grid>
                  <Grid item xs={4}>
                  <img src={yutub} alt="" />
                  </Grid>
                  <Grid item xs={4}>
                  <img src={tele} alt="" />
                  </Grid>
                  <Grid item xs={4}>
                  <img src={email} alt="" />
                  </Grid>
                </Grid>:
                <Stack direction="row" spacing={2}>
                <img src={phone} alt="" />
                <img src={ig} alt="" />
                <img src={yutub} alt="" />
                <img src={tele} alt="" />
                <img src={email} alt="" />
                </Stack>
                }
                </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
 );
};

export default Footer;
