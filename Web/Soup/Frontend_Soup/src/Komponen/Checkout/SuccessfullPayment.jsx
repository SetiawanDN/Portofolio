import React from 'react';
import SuccessfullImage from '../../assets/images/Successfull.png';
import home from '../../assets/images/home.png';
import panah from '../../assets/images/panah.png';
import { useNavigate } from "react-router";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack';


const SuccessfullPayment = () => {
  const navigate = useNavigate()
  return (
    <Container maxWidth="xs">
      <img
        src={SuccessfullImage}
        alt="Success"
        style={{
          width: '50%',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />
      <Typography color="primary" fontSize={24} fontWeight={500} marginTop={5} marginBottom={1} textAlign={'center'}>Purchase Successfully</Typography>
      <Typography color="primary" fontSize={15.9} fontWeight={400} marginBottom={4} textAlign={'center'}>
        Horay!! Let’s cook and become a professional chef
      </Typography>
      <Stack spacing={4} direction="row">
        <button variant="contained" style={{ 
            width: '182px',
            height: '50px',
            padding: '16px 24px',
            borderRadius: '6px',
            border: '1px solid',
            gap: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            backgroundImage: `url(${home})`,
            backgroundPosition: '10px center',
            backgroundRepeat: 'no-repeat',
            paddingLeft: '44px',
            color: '#5B4947',
            fontSize: '15px',
            fontWeight: '600',
            lineHeight: '18px',
            letterSpacing: '0em',
            textAlign: 'left',
            fontFamily: 'Montserrat Variable',
            cursor: 'pointer',
          }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
        <button onClick={() => navigate("/invoice")} variant="contained" style={{ 
            width: '182px',
            height: '50px',
            padding: '16px 24px',
            borderRadius: '6px',
            border: '1px solid',
            gap: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FABC1D',
            backgroundImage: `url(${panah})`,
            backgroundPosition: '10px center',
            backgroundRepeat: 'no-repeat',
            paddingLeft: '40px',
            color: '#5B4947',
            fontSize: '15px',
            fontWeight: '600',
            lineHeight: '18px',
            letterSpacing: '0em',
            textAlign: 'left',
            fontFamily: 'Montserrat Variable',
            cursor: 'pointer',
          }}
        >
          Open Invoice
        </button>
      </Stack>
    </Container>
  );
};

export default SuccessfullPayment;
