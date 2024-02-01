import React from 'react';
import { Typography, Grid } from '@mui/material';
import Bakground1 from '../../assets/images/Bakground1.png';

const Banner1 = () => {
  const bannerStyle = {
    backgroundImage: `url(${Bakground1})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '274px',
    // width: '100%',
    top: '86px',
    display: 'grid',
    placeItems: 'center',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
    fontFamily: 'Montserrat Variable',
  };

  const contentWrapper = {
    display: 'grid',
    gap: '10px',
    textAlign: 'center',
  };

  const headingStyles = {
    fontSize: '32px',
    fontWeight: '600',
    marginBottom: '10px',
  };

  const customStyle = {
    fontSize: '24px',
    fontWeight: '400',
    lineHeight: '1.2',
    letterSpacing: '0em',
  };

  return (
    <div style={bannerStyle}>
      <Grid container maxWidth="lg" justifyContent="center">
        <Grid item xs={12} md={8}>
          <div style={contentWrapper}>
            <Typography variant="h2" style={headingStyles}>
              Be the next great chef
            </Typography>
            <Typography variant="body1" style={customStyle}>
              We are able to awaken your cooking skills to become a classy chef and ready to dive into the professional world
            </Typography>
            
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Banner1;
