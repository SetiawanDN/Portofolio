import { Button, Container, Divider, Grid, Stack, TextField, Typography, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useGetDescMenuComponent from "./customHook/useGetDescMenuComponent";

const DescMenuComponent = ({typeName}) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const {loading, desc} = useGetDescMenuComponent(typeName);
    
    return (
        loading ?
        <>
        <Container maxWidth="lg">
        <div style={{display:"flex", justifyContent:"center", alignItems:"center", marginTop:30, marginBottom:30}}>
            <CircularProgress/>
        </div>
        </Container>
        <Divider/>
        </>
        :
        <>
        <div style={{maxHeight:300, overflow:"hidden", marginBottom:30}}>
            <img src={`${apiUrl}/${desc.image}`} alt="" style={{width:"100%", position:"relative", transform:"translateY(-20%)"}}/>
        </div>
        <Container maxWidth="lg">
            <Typography marginBottom={2} fontSize={24} fontWeight={600} color="initial">{desc.name}</Typography>
            <Typography marginBottom={10} fontSize={16} fontWeight={400} color="initial">
                {desc.description}
            </Typography>
        </Container>
        <Divider/>
        </>
      );
};

DescMenuComponent.propTypes = {
    typeName: PropTypes.string.isRequired,
};

export default DescMenuComponent