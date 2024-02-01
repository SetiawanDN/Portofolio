import { Box, Container, Typography, Grid, CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router';
import useGetItemList1 from '../../customHook/useGetItemList1'

const ItemList = () => {    
    const navigate = useNavigate()
    const apiUrl = import.meta.env.VITE_API_URL
    const {loading, itemData1} = useGetItemList1();

    return (
        <>
            <Container maxWidth="lg">
                <Typography marginBottom={8} fontSize={32} fontWeight={600} color="primary" textAlign={'center'}>
                    More professional class
                </Typography>
                {loading ? 
                <div style={{display:"flex", justifyContent:"center", alignItems:"center", marginBottom:50}}>
                <CircularProgress />
                </div>
                : 
                <Grid marginBottom={20} container spacing={3}>
                    {itemData1.map((item, key) => (
                        <Grid item key={key} xs={12} sm={6} md={4}>
                            <img
                                srcSet={`${apiUrl}/${item.image}`}
                                src={`${apiUrl}/${item.image}`}
                                alt={item.name}
                                loading="lazy"
                                width="100%"
                                onClick={() => navigate(`/detail/${item.category_id}/${item.id}`)}
                                style={{cursor: "pointer"}}
                            />
                            <Box marginY={1} component="section" sx={{ width: 318, height: 94 }}>
                                <Typography color="#828282" fontSize={16}>{item.category_name}</Typography>
                                <Typography color="primary" fontSize={20} fontWeight={600}>{item.name}</Typography>
                            </Box>
                            <Typography marginBottom={8} color="secondary" fontSize={20} fontWeight={600}>
                            IDR {Intl.NumberFormat('id').format(item.price)}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
                }
            </Container>
        </>
    );
};

export default ItemList;
