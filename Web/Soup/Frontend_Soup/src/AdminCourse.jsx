import '@fontsource-variable/montserrat';
import { Typography, Container, TextField, Button, Stack, Backdrop, CircularProgress, MenuItem, Alert, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid, useGridApiContext, useGridApiRef} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import useAuth from './customHook/useAuth';

const apiUrl = import.meta.env.VITE_API_URL

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const isActivatedOptions = [
  {
    value: true,
    label: 'true',
  },
  {
    value: false,
    label: 'false',
  },
];

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 120 },
  { field: 'description', headerName: 'Description', width: 120 },
  { field: 'price', headerName: 'Price', width: 120 },
  { field: 'image', headerName: 'Image', width: 150, renderCell: (params) => <img src={`${apiUrl}/${params.value}`} />},
  { field: 'isActivated', headerName: 'isActivated', width: 90 },
];

const AdminCourse = () => {
    const {token} = useAuth()
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState(()=>[])
    const [selectedRow, setSelectedRow] = useState();
    const [categories, setCategories] = useState([]);
    
    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [image, setImage] = useState(null)

    const [categoryTable, setCategoryTable] = useState("")

    const [idUpdate, setIdUpdate] = useState("")
    const [nameUpdate, setNameUpdate] = useState("")
    const [categoryUpdate, setCategoryUpdate] = useState("")
    const [descriptionUpdate, setDescriptionUpdate] = useState("")
    const [priceUpdate, setPriceUpdate] = useState("")
    const [imageUpdate, setImageUpdate] = useState(null)
    const [isActivatedUpdate, setIsActivatedUpdate] = useState(true)

    async function GetCategoryData(){
      setLoading(true);

      const res = await axios(
        `${apiUrl}/api/Category/GetAllAdmin`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const {data, status} = res

      if(status!=200) return
      setLoading(false);
      setCategories(data);
    }

    async function GetProductData(){
      setLoading(true);
      
      const res = await axios(
        `${apiUrl}/api/Product/GetByCategoryIdAdmin/${categoryTable}`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const {data, status} = res

      if(status!=200) return
      setLoading(false);
      setRows(data);
    }

    useEffect(()=>{
      //GetProductData();
      GetCategoryData();
    } , [])

    useEffect(()=>{
      if(categoryTable){
        GetProductData()
      }
    } , [categoryTable])

    const handleAdd = () => {
      setLoading(true)
      const formdata = new FormData()
      formdata.append("name", name)
      formdata.append("description", description)
      formdata.append("price", price)
      formdata.append("image", image)
      formdata.append("fk_id_category", category)

      axios.post(`${apiUrl}/api/Product/Create`, formdata, {headers:{
        "Content-Type": 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }}).then(function (response) {
        handleSnackbar("Penambahan kelas berhasil", "success")
        GetProductData();
        setLoading(false);
      })
      .catch(function (error) {
        if(error.response.status==401){
          handleSnackbar('Session expired, mohon login kembali', "warning");
          setLoading(false)
        }else{
          handleSnackbar("Terdapat kesalahan input", "error")
        }
        setLoading(false);
      });
    }

    const handleUpdate = () => {
      setLoading(true)
      const formdata = new FormData()
      formdata.append("name", nameUpdate)
      formdata.append("description", descriptionUpdate)
      formdata.append("price", priceUpdate)
      formdata.append("image", imageUpdate)
      formdata.append("fk_id_category", categoryUpdate)

      axios.patch(`${apiUrl}/api/Product/Update/${idUpdate}`, formdata, {headers:{
        "Content-Type": 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }}).then(function (response) {
        handleSnackbar("Kelas berhasil diupdate", "success")
        GetProductData();
        setIdUpdate('')
        setNameUpdate('')
        setCategoryUpdate('')
        setDescriptionUpdate('')
        setPriceUpdate('')
        setIsActivatedUpdate('')
        setLoading(false);
      })
      .catch(function (error) {
        if(error.response.status==401){
          handleSnackbar('Session expired, mohon login kembali', "warning");
          setLoading(false)
        }else{
          handleSnackbar("Terdapat kesalahan input", "error")
        }
        setLoading(false);
      });
    }

    const handleUpdateIsActivated = () => {
      setLoading(true)  
      axios.patch(`${apiUrl}/api/Product/UpdateIsActivated/${idUpdate}`, {isActivated: isActivatedUpdate}, {headers:{
        Authorization: `Bearer ${token}`
      }}).then(function (response) {
        handleSnackbar("isActivated Kelas berhasil diupdate", "success")
        GetProductData();
        setLoading(false);
      })
      .catch(function (error) {
        if(error.response.status==401){
          handleSnackbar('Session expired, mohon login kembali', "warning");
          setLoading(false)
        }else{
          handleSnackbar("Terdapat kesalahan input", "error")
        }
        setLoading(false);
      });
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
  
    const handleSnackbar = (message, severity) => {
      setSnackbarData({
        open: true,
        message: message,
        severity: severity,
      });
    };

    return(
        <>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit"/>
        </Backdrop>

        <Container maxWidth="md">

          {/* ADD COURSE*/}
          <Typography marginBottom={2} fontSize={32} fontWeight={600} color="primary" textAlign={'center'}>
            Course
          </Typography>
          <Typography fontSize={20} fontWeight={400} color="primary" textAlign={'center'}>
            Add Course Data
          </Typography>
          <Stack gap={3}>
          <TextField
            fullWidth
            id="Course_name"
            label="Course Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
          <TextField
            id="outlined-select-currency"
            select
            label="Select Category"
            value={category}
            onChange={(e)=>setCategory(e.target.value)}
          >
            {categories.map((option) => (
              <MenuItem key={option.value} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            multiline
            id="description"
            label="Course Description"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />
          <TextField
            fullWidth
            id="price"
            label="Course Price"
            value={price}
            type='number'
            onChange={(e)=>{
              const inputValue = e.target.value;
              if (inputValue === "" || (parseInt(inputValue) >= 0)) {
                setPrice(inputValue);
              }
            }}
          />
          <div>
          <Button aria-description='Course Image' component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload Course Image
            <VisuallyHiddenInput type="file" onChange={(e)=> setImage(e.target.files[0])} />
          </Button>
          <Typography fontSize={14} fontWeight={400} color="primary" textAlign={'left'}>
          {image? image.name:''}
          </Typography>
          </div> 
          <Button onClick={handleAdd} variant="contained" color="secondary" style={{textTransform:'none'}} sx={{width:200, height:40, borderRadius: 2} }>ADD COURSE</Button>
          </Stack>

          {/* TABLE DATA */}
          <Typography marginTop={10} fontSize={24} fontWeight={500} color="primary" textAlign={'center'}>
            Course's Data
          </Typography>
          <TextField
            id="category-for-table-data"
            select
            fullWidth
            label="Select Category"
            value={categoryTable}
            onChange={(e)=>{
              setIdUpdate('')
              setNameUpdate('')
              setCategoryUpdate('')
              setDescriptionUpdate('')
              setPriceUpdate('')
              setIsActivatedUpdate('')
              setCategoryTable(e.target.value)}
            }
          >
            {categories.map((option) => (
              <MenuItem key={option.value} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
            <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            onRowSelectionModelChange={item => {
              //console.log(item.length)
              if(item.length!=0){
                setSelectedRow(item[0])
                setIdUpdate(rows.find(x=>x.id==item[0]).id)
                setNameUpdate(rows.find(x=>x.id==item[0]).name)
                setCategoryUpdate(rows.find(x=>x.id==item[0]).category_id)
                setDescriptionUpdate(rows.find(x=>x.id==item[0]).description)
                setPriceUpdate(rows.find(x=>x.id==item[0]).price)
                setIsActivatedUpdate(rows.find(x=>x.id==item[0]).isActivated)
              }
            }}
            pageSizeOptions={[5, 10]}
            />

            {/* UPDATE COURSE */}
            <Typography marginTop={5} fontSize={20} fontWeight={400} color="primary" textAlign={'center'}>
              Update Course
            </Typography>
            <Stack gap={3} marginTop={2}>
              <TextField
                fullWidth
                id="category_id_update"
                label={!idUpdate? 'Pilih data di tabel terlebih dahulu' : 'Course ID'}
                disabled
                value={idUpdate}
              />
              <TextField
                fullWidth
                id="category_name_update"
                label="Course Name"
                value={nameUpdate}
                onChange={(e)=>setNameUpdate(e.target.value)}
              />
              <TextField
                id="outlined-select-currency"
                select
                label="Select Category"
                value={categoryUpdate}
                onChange={(e)=>setCategoryUpdate(e.target.value)}
              >
                {categories.map((option) => (
                  <MenuItem key={option.value} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                multiline
                id="description_update"
                label="Course Description"
                value={descriptionUpdate}
                onChange={(e)=>setDescriptionUpdate(e.target.value)}
              />
              <TextField
                fullWidth
                id="price_update"
                label="Course Price"
                value={priceUpdate}
                type='number'
                onChange={(e)=>setPriceUpdate(e.target.value)}
              />
              <div>
              <Button aria-description='Category Image Update' component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                Upload Course Image
                <VisuallyHiddenInput type="file" onChange={(e)=> setImageUpdate(e.target.files[0])} />
              </Button>
              <Typography fontSize={14} fontWeight={400} color="primary" textAlign={'left'}>
              {imageUpdate? imageUpdate.name:'Upload file jika ada perubahan gambar'}
              </Typography>
              </div> 
              <Button onClick={handleUpdate} variant="contained" color="secondary" style={{textTransform:'none'}} sx={{width:200, height:40, borderRadius: 2} }>UPDATE COURSE</Button>
            </Stack>

            {/* UPDATE COURSE isActivated */}
            <Typography marginTop={5} fontSize={20} fontWeight={400} color="primary" textAlign={'center'}>
              Update IsActivated
            </Typography>
            <Stack gap={3} marginTop={2}>
              <TextField
                fullWidth
                id="category_id_update_isActivated"
                label={!idUpdate? 'Pilih data di tabel terlebih dahulu' : 'Course ID'}
                disabled
                value={idUpdate}
              />
              <TextField
                id="outlined-select-currency"
                select
                label="Select"
                helperText="Course isActivated"
                value={isActivatedUpdate}
                onChange={(e)=>setIsActivatedUpdate(e.target.value)}
              >
                {isActivatedOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button onClick={handleUpdateIsActivated} variant="contained" color="secondary" style={{textTransform:'none'}} sx={{width:200, height:40, borderRadius: 2} }>UPDATE COURSE</Button>
            </Stack>
      
          </Container>
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
                '& .MuiAlert-icon': { color: snackbarColor(snackbarData.severity) },
              }}
            >
              {snackbarData.message}
            </Alert>
          </Snackbar>
        </>
    )
}

export default AdminCourse