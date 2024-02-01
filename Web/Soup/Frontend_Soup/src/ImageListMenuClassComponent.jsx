import { Box, Button, Container, Divider, Typography, useMediaQuery, Grid, CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ImageListMenuClassComponent = ({typeName, filterID}) => {
    const navigate = useNavigate()
    const apiUrl = import.meta.env.VITE_API_URL
    const [menu, setMenu] = useState([])
    const [loading, setLoading] = useState(true)
    const [blank, setBlank] = useState(false)

    useEffect(() => {
        async function GetMenu(){
            setLoading(true)
            const res = await axios(
                `${apiUrl}/api/Product/GetByCategoryId/${typeName}`
            )
            const {data, status} = res
            if(status!=200) return
            setLoading(false)
            //filtering data by filterID
            //console.log(data.filter((el) => !data.filter(x => x.id_menu == filterID).includes(el)))
            //setMenu(data.filter((el) => !data.filter(x => x.id_menu == filterID).includes(el)))
            setMenu(data)
            if((data.length==1 && filterID) || data.length==0){
                 setBlank(true)
            }
        }
        GetMenu()
    }, [setMenu])

    if(loading){
        return(
            <>
            <Container maxWidth="lg">
            <Typography marginTop={5} marginBottom={10} fontSize={32} fontWeight={600} color="primary" textAlign={'center'}>Another menu in this class</Typography>
            <div style={{display:"flex", justifyContent:"center", alignItems:"center", marginBottom:50}}>
                <CircularProgress/>
            </div>
            </Container>
            </>
        )
    }

    return (
        <>
        <Container maxWidth="lg">
            <Typography marginTop={5} marginBottom={10} fontSize={32} fontWeight={600} color="primary" textAlign={'center'}>Another menu in this class</Typography>
            {blank?
            <Typography marginTop={5} marginBottom={10} fontSize={32} fontWeight={400} color="primary" textAlign={'center'}>There's no menu</Typography>:
            <Grid marginBottom={20} container spacing={3}>
                {menu.map((item, key) => (
                    item.id!=filterID ?
                    <Grid marginBottom={8} item key={key} xs={12} sm={6} md={4}> 
                    <img
                        srcSet={`${apiUrl}/${item.image}`}
                        src={`${apiUrl}/${item.image}`}
                        alt={item.name}
                        width="100%"
                        loading="lazy"
                        onClick={() => navigate(`/detail/${item.category_id}/${item.id}`)}
                        style={{cursor: "pointer"}}
                    />
                    <Box marginY={2} component="section" sx={{ width: 318, height:94}}>
                        <Typography color="#828282" fontSize={16}>{item.category_name}</Typography>
                        <Typography color="primary" fontSize={20} fontWeight={600}>{item.name}</Typography>
                    </Box>
                    <Typography color="secondary" fontSize={20} fontWeight={600}>
                        IDR {Intl.NumberFormat('id').format(item.price)}
                    </Typography>
                    </Grid> : <></>
                ))}
            </Grid>}
        </Container>
        </>
      );
};

ImageListMenuClassComponent.propTypes = {
    typeName: PropTypes.string.isRequired,
    filterID: PropTypes.string,
};

export default ImageListMenuClassComponent