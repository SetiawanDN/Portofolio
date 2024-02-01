import { Button, Container, Divider, Grid, Typography, CircularProgress, Backdrop, FormControl, FormLabel, FormHelperText, InputLabel, Select, MenuItem, Snackbar, Alert} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router';
import PropTypes from "prop-types";
import useGetDescDetailComponent from "./customHook/useGetDescDetailComponent";
import { DatePicker } from "@mui/x-date-pickers";
import useAuth from "./customHook/useAuth";
import PaymentMethodPage from "./PaymentMethodPage";

const DescDetailComponent = ({typeName, id}) => {
    const navigate = useNavigate()
    const {token} = useAuth()
    const apiUrl = import.meta.env.VITE_API_URL
    const {loading, desc} = useGetDescDetailComponent(typeName);

    const [loadingPost, setLoadingPost] = useState(false)
    const [schedule, setSchedule] = useState('')
    const [scheduleError, setScheduleError] = useState('')
    const [schedules, setSchedules] = useState([])
    const [loadingPayment, setLoadingPayment] = useState(false)
    const [paymentMethods, setPaymentMethods] = useState([])
    const [showPaymentMethod, setShowPaymentMethod] = useState(false);
    
    const ToDate = (date) => {
      const a = new Date(date);
      const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const stringDate = day[a.getDay()] + ', ' + a.getDate() + ' ' + month[a.getMonth()] + ' ' + a.getFullYear()  
      return stringDate;
    }

    const ToISODateString = (date) => {
      //code buat ubah ke iso string
      let a = new Date(date);
      const offset = a.getTimezoneOffset()
      a = new Date(a.getTime() - (offset*60*1000))
      return a.toISOString().split('T')[0]
    }

    const GetEligibleSchedule = () => {    
      let i = 0
      const array = []
      while(array.length<7){
        let tempDate = new Date()
        if(!(tempDate.getDay()+i==0) && !((tempDate.getDay()+i)%7==0)){
          array.push(tempDate.setDate(tempDate.getDate()+i))
        }
        i = i + 1
      }
      return array
    }

    async function getPaymentMethods(){
      setLoadingPayment(true);
  
      const res = await axios(
        `${apiUrl}/api/PaymentMethod/GetAll`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      const { data, status } = res;
  
      if (status != 200) return;
      setLoadingPayment(false);
      setPaymentMethods(data);
    }

    const snackbarBackgroundColor = (severity) => {
      switch (severity) {
        case 'error':
          return '#ff3333';
        case 'warning':
          return '#d14000';
        case 'success':
          return '#008000';
        default:
          return '#d14000';
      }
    };
    
    const snackbarColor = (severity) => {
      return severity === 'warning' ? 'white' : 'white';
    };

    const [snackbarData, setSnackbarData] = useState({
      open: false,
      message: '',
      severity: ''
    });
    
    const handleCloseSnackbar = () => {
      setSnackbarData({ ...snackbarData, open: false });
    };

    useEffect(()=>{
      getPaymentMethods()
      setSchedules(GetEligibleSchedule())
    }, [])

    const AddtoCart = () => {
      if (!schedule) {
        setScheduleError('Pilih jadwal terlebih dahulu');
      } else {
        setLoadingPost(true);
        axios.post(`${apiUrl}/api/Cart/Create`, {
            fk_id_product: id,
            schedule: schedule
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(function(response) {
            setSnackbarData({
              open: true,
              message: 'Penambahan cart berhasil',
              severity: 'success'
            });
            setLoadingPost(false);
          })
          .catch(function(error) {
            if (error.response.status === 401) {
              setSnackbarData({
                open: true,
                message: 'Session expired, mohon login kembali',
                severity: 'error'
              });
            } else if (error.response.status === 500) {
              setSnackbarData({
                open: true,
                message: 'Anda menambahkan kelas yang sama pada jadwal yang sama pada cart',
                severity: 'warning'
              });
            } else {
              setSnackbarData({
                open: true,
                message: error.message,
                severity: 'error'
              });
            }
            setLoadingPost(false);
          });
      }
    }

    const BuyNow = () => {
        if(!schedule){
          setScheduleError('Pilih jadwal terlebih dahulu')
        }else{
          setShowPaymentMethod(true);
        }
    }

    const handleClosePaymentMethod = () => {
      setShowPaymentMethod(false);
    };

    return (
        loading || loadingPayment ? 
        <>
        <Container maxWidth="lg">
        <div style={{display:"flex", justifyContent:"center", alignItems:"center", marginTop:30, marginBottom:30}}>
            <CircularProgress/>
        </div>
        </Container>
        <Divider/>
        </>:
        <>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loadingPost}
            >
            <CircularProgress color="inherit"/>
        </Backdrop>
        <Container maxWidth="lg" sx={{overflowX:"hidden"}}>
            <Grid container spacing={5}>
              <Grid item sm={12} md={6}>
                <img src={`${apiUrl}/${desc.find(x=>x.id==id).image}`} width={"100%"}/>
              </Grid>
              <Grid item sm={12} md={6}>
                <Box component="section" sx={{ width: 700, height:266}}>
                    <Typography color="#828282" fontSize={16}>{desc.find(x=>x.id==id).category_name}</Typography>
                    <Typography color="#0" fontSize={20} fontWeight={600} marginY={1}>{desc.find(x=>x.id==id).name}</Typography>
                    <Typography color="primary" fontSize={20} fontWeight={600}>
                        IDR {Intl.NumberFormat('id').format(desc.find(x=>x.id==id).price)}
                    </Typography>
                    <Box component="section" sx={{ width: 300, height:40}} marginTop={5} marginBottom={10}>
                        {/* <DatePicker disablePast label="Select Schedule" onChange={(e)=>{setSchedule(e); setScheduleError("");}}/>
                        <Typography color="#E10600" fontSize={12} fontWeight={400}>
                        {scheduleError}
                        </Typography> */}
                        <FormControl fullWidth>
                        <InputLabel>Select Schedule</InputLabel>
                        <Select value={schedule} label="Select Schedule" onChange={(e)=>{setSchedule(e.target.value); setScheduleError("");}} error={scheduleError ? true : false}>
                          {schedules.map((sched) => (
                            <MenuItem key={ToISODateString(sched)} value={ToISODateString(sched)}>{ToDate(sched)}</MenuItem>
                          ))}
                        </Select>
                        <Typography color="#E10600" fontSize={12} fontWeight={400}>
                        {scheduleError}
                        </Typography>
                    </FormControl>
                    </Box>
                    <Grid container spacing={2} maxWidth="400px">
                        <Grid item lg={6} md={12}>
                        <Box component={"section"}>
                            <Button onClick={() => AddtoCart()} fullWidth variant="outlined" style={{textTransform:'none', fontSize:16}}>
                                Add to Cart
                            </Button>
                        </Box>
                        </Grid>
                        <Grid item lg={6} md={12}>
                        <Box component={"section"}>
                            <Button onClick={() => BuyNow()} fullWidth variant="contained" color="secondary" style={{textTransform:'none', fontSize:16}}>
                                Buy Now
                            </Button>
                        </Box>
                        </Grid>
                    </Grid>
                </Box>
              </Grid>
            </Grid>
            <Typography marginBottom={2} marginTop={8} fontSize={24} fontWeight={600} color="initial">Description</Typography>
            <Typography marginBottom={10} fontSize={16} fontWeight={400} color="initial">
                {desc.find(x=>x.id==id).description}
            </Typography>
        </Container>
        <Divider/>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showPaymentMethod}
          >
          <PaymentMethodPage handleClose={handleClosePaymentMethod} paymentMethods={paymentMethods} isBuyNow={true} id_product={id} schedule={schedule}/>
        </Backdrop>
        <Snackbar
          open={snackbarData.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarData.severity}
            sx={{
              width: '100%',
              backgroundColor: snackbarBackgroundColor(snackbarData.severity),
              color: snackbarColor(snackbarData.severity),
              '& .MuiAlert-icon': { color: snackbarColor(snackbarData.severity) }
            }}
          >
            {snackbarData.message}
          </Alert>
        </Snackbar>
        </>
      );
};

DescDetailComponent.propTypes = {
   typeName: PropTypes.string.isRequired,
   id: PropTypes.string.isRequired,
};

export default DescDetailComponent