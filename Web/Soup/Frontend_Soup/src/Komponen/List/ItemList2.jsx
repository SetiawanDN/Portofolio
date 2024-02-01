import { Card, CardContent, CardMedia, Container, Typography, Grid, CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router';
import useGetItemList2 from '../../customHook/useGetItemList2'

const ItemList2 = () => {
    const navigate = useNavigate()
    const apiUrl = import.meta.env.VITE_API_URL
    const {loading, itemData2} = useGetItemList2();

    return (
        <>
            <Container maxWidth="lg">
                <Typography marginTop={15}  marginBottom={10} fontSize={32} fontWeight={600} color="primary" textAlign={'center'}>
                    More food type as you can choose
                </Typography>
                {loading ? 
                <div style={{display:"flex", justifyContent:"center", alignItems:"center", marginBottom:50}}>
                <CircularProgress />
                </div>
                :
                <Grid marginBottom={20} container spacing={3}>
                    {itemData2.map((item, key) => (
                        <Grid marginBottom={5} item key={key} xs={12} sm={6} md={3}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    image={`${apiUrl}/${item.image}`}
                                    width={200}
                                    height={133.33}
                                    alt={item.name}
                                    loading="lazy"
                                    onClick={() => navigate(`/menu-list/${item.id}`)}
                                    style={{cursor: "pointer"}}
                                />
                                <CardContent>
                                    <Typography variant="h6" color="textPrimary" textAlign={'center'} gutterBottom>
                                        {item.name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                }
            </Container>
        </>
    );
};

export default ItemList2;
