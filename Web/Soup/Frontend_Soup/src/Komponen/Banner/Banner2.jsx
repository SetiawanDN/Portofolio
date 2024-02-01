import React, { useEffect, useState } from 'react';
import { Typography, Grid, useMediaQuery } from '@mui/material';
import BenefitBaner from '../../assets/images/BenefitBaner.png';
import { useTheme } from '@emotion/react';

const Banner2 = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [bannerHeight, SetBannerHeight] = useState()
  
  useEffect(()=>{
    if(isMobile){
      SetBannerHeight('450px')
    }else{
      SetBannerHeight('274px')
    }
  }, [isMobile])

  const BenefitbannerStyle = {
    backgroundImage: `url(${BenefitBaner})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: bannerHeight,
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
  };

  const headingStyles = {
    fontSize: '40px',
    fontWeight: '600',
    marginBottom: '10px',
    textAlign: 'justify',
  };

  const customStyle = {
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '1.2',
    letterSpacing: '0em',
    textAlign: 'justify',
  };

  return (
    <div style={BenefitbannerStyle}>
      <Grid container maxWidth="lg" justifyContent="center">
        <Grid item xs={12} md={8}>
          <div style={contentWrapper}>
            <Typography variant="h2" style={headingStyles}>
              Gets your best benefit
            </Typography>
            <Typography variant="body1" style={customStyle}>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam.
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Banner2;
