import '@fontsource-variable/montserrat';
import { Typography, Container, TextField, Button, Stack, Backdrop, CircularProgress, MenuItem, Alert, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid, useGridApiRef} from '@mui/x-data-grid';
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
  { field: 'image', headerName: 'Image', width: 150, renderCell: (params) => <img src={`${apiUrl}/${params.value}`} />},
  { field: 'isActivated', headerName: 'isActivated', width: 90 },
];

const AdminCategory = () => {
    const {token} = useAuth()
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState(()=>[])
    const [selectedRow, setSelectedRow] = useState();
  
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState(null)

    const [idUpdate, setIdUpdate] = useState("")
    const [nameUpdate, setNameUpdate] = useState("")
    const [descriptionUpdate, setDescriptionUpdate] = useState("")
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
      setRows(data);
    }

    useEffect(()=>{
      GetCategoryData();
    } , [])

    const handleAdd = () => {
      setLoading(true)
      const formdata = new FormData()
      formdata.append("name", name)
      formdata.append("description", description)
      formdata.append("image", image)

      axios.post(`${apiUrl}/api/Category/Create`, formdata, {headers:{
        "Content-Type": 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }}).then(function (response) {
        handleSnackbar("Penambahan kategori berhasil", "success")
        GetCategoryData();
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
      formdata.append("image", imageUpdate)

      axios.patch(`${apiUrl}/api/Category/Update/${idUpdate}`, formdata, {headers:{
        "Content-Type": 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }}).then(function (response) {
        handleSnackbar("Kategori berhasil diupdate", "success")
        GetCategoryData();
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
      axios.patch(`${apiUrl}/api/Category/UpdateIsActivated/${idUpdate}`, {isActivated: isActivatedUpdate}, {headers:{
        Authorization: `Bearer ${token}`
      }}).then(function (response) {
        handleSnackbar("isActivated Kategori berhasil diupdate", "success")
        GetCategoryData();
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

          {/* ADD CATEGORY */}
          <Typography marginBottom={2} fontSize={32} fontWeight={600} color="primary" textAlign={'center'}>
            Category
          </Typography>
          <Typography fontSize={20} fontWeight={400} color="primary" textAlign={'center'}>
            Add Category Data
          </Typography>
          <Stack gap={3}>
          <TextField
            fullWidth
            id="category_name"
            label="Category Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            id="description"
            label="Category Description"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />
          <div>
          <Button aria-description='Category Image' component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload Category Image
            <VisuallyHiddenInput type="file" onChange={(e)=> setImage(e.target.files[0])} />
          </Button>
          <Typography fontSize={14} fontWeight={400} color="primary" textAlign={'left'}>
          {image? image.name:''}
          </Typography>
          </div> 
          <Button onClick={handleAdd} variant="contained" color="secondary" style={{textTransform:'none'}} sx={{width:200, height:40, borderRadius: 2} }>ADD CATEGORY</Button>
          </Stack>

          {/* TABLE DATA */}
          <Typography marginTop={10} fontSize={24} fontWeight={500} color="primary" textAlign={'center'}>
            Category's Data
          </Typography>
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
              setSelectedRow(item[0])
              setIdUpdate(rows.find(x=>x.id==item[0]).id)
              setNameUpdate(rows.find(x=>x.id==item[0]).name)
              setDescriptionUpdate(rows.find(x=>x.id==item[0]).description)
              setIsActivatedUpdate(rows.find(x=>x.id==item[0]).isActivated)
            }}
            pageSizeOptions={[5, 10]}
            />

            {/* UPDATE CATEGORY */}
            <Typography marginTop={5} fontSize={20} fontWeight={400} color="primary" textAlign={'center'}>
              Update Category
            </Typography>
            <Stack gap={3} marginTop={2}>
              <TextField
                fullWidth
                id="category_id_update"
                label={!idUpdate? 'Pilih data di tabel terlebih dahulu' : 'Category ID'}
                disabled
                value={idUpdate}
              />
              <TextField
                fullWidth
                id="category_name_update"
                label="Category Name"
                value={nameUpdate}
                onChange={(e)=>setNameUpdate(e.target.value)}
              />
              <TextField
                fullWidth
                multiline
                id="description_update"
                label="Category Description"
                value={descriptionUpdate}
                onChange={(e)=>setDescriptionUpdate(e.target.value)}
              />
              <div>
              <Button aria-description='Category Image Update' component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                Upload Category Image
                <VisuallyHiddenInput type="file" onChange={(e)=> setImageUpdate(e.target.files[0])} />
              </Button>
              <Typography fontSize={14} fontWeight={400} color="primary" textAlign={'left'}>
              {imageUpdate? imageUpdate.name:'Upload file jika ada perubahan gambar'}
              </Typography>
              </div> 
              <Button onClick={handleUpdate} variant="contained" color="secondary" style={{textTransform:'none'}} sx={{width:200, height:40, borderRadius: 2} }>UPDATE CATEGORY</Button>
            </Stack>

            {/* UPDATE CATEGORY isActivated */}
            <Typography marginTop={5} fontSize={20} fontWeight={400} color="primary" textAlign={'center'}>
              Update IsActivated
            </Typography>
            <Stack gap={3} marginTop={2}>
              <TextField
                fullWidth
                id="category_id_update_isActivated"
                label={!idUpdate? 'Pilih data di tabel terlebih dahulu' : 'Category ID'}
                disabled
                value={idUpdate}
              />
              <TextField
                id="outlined-select-currency"
                select
                label="Select"
                helperText="Category isActivated"
                value={isActivatedUpdate}
                onChange={(e)=>setIsActivatedUpdate(e.target.value)}
              >
                {isActivatedOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button onClick={handleUpdateIsActivated} variant="contained" color="secondary" style={{textTransform:'none'}} sx={{width:200, height:40, borderRadius: 2} }>UPDATE CATEGORY</Button>
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

export default AdminCategory