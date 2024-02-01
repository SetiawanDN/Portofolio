import React from 'react';
import SuccessfullImage from './assets/images/Successfull.png';
import { useNavigate, useParams } from "react-router";
import Button from '@mui/material/Button';
import axios from 'axios';
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box';

const SuccessConfirmation = () => {
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL
  const {token} = useParams()

  axios.post(`${apiUrl}/Verify`, {
          token: token
        }).then(function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error)
        });

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
      <Typography color="primary" fontSize={24} fontWeight={500} marginTop={5} marginBottom={1} textAlign={'center'}>
        Email Confirmation Success
      </Typography>
      <Typography color="primary" fontSize={15.9} fontWeight={400} marginBottom={4} textAlign={'center'}>
        Congratulations! your email has already used.
      </Typography>
      <Box textAlign={'center'}>
        <Button onClick={() => navigate("/login")} variant="contained" color="secondary" style={{textTransform:'none', fontSize:16, marginLeft:'auto', marginRight:'auto'}} sx={{width:175, height:50, borderRadius: 2} }>
          Login Here
        </Button>
      </Box>
    </Container>
  );
};

export default SuccessConfirmation;
