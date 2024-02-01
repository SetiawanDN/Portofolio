import '@fontsource-variable/montserrat';
import { Typography, Container, TextField, Button, Stack, Backdrop, CircularProgress, MenuItem, Snackbar, Alert } from '@mui/material';
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

const roleOptions = [
  {
    value: 'user',
    label: 'User',
  },
  {
    value: 'admin',
    label: 'Admin',
  },
];

const columns = [
  { field: 'id', headerName: 'ID', width: 5 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'role', headerName: 'Role', width: 70},
  { field: 'isActivated', headerName: 'isActivated', width: 90 },
];

const AdminUser = () => {
    const {token} = useAuth()
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState(()=>[])
    const [selectedRow, setSelectedRow] = useState();
  
    const [name, setName] = useState("");
    const [firstName, setFirstName] = useState(true);
    const [email, setEmail] = useState("");
    const [firstEmail, setFirstEmail] = useState(true);
    const [password, setPassword] = useState("");
    const [firstPassword, setFirstPassword] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstConfirmPassword, setFirstConfirmPassword] = useState(true);
    const [role, setRole] = useState("")

    const [idUpdate, setIdUpdate] = useState("")
    const [nameUpdate, setNameUpdate] = useState("");
    const [firstNameUpdate, setFirstNameUpdate] = useState(true);
    const [emailUpdate, setEmailUpdate] = useState("");
    const [firstEmailUpdate, setFirstEmailUpdate] = useState(true);
    const [roleUpdate, setRoleUpdate] = useState("")
    const [isActivatedUpdate, setIsActivatedUpdate] = useState(true)

    const validateName = (name) => {
      if (String(name).match(/^[a-zA-Z_]+( [a-zA-Z_]+)*$/)) {
        return "";
      } else {
        return "Penulisan nama belum sesuai";
      }
    }
    const validatePassword = (password) => {
      if (password.length < 8) {
        return "Password kurang dari 8 karakter";
      } else {
        return "";
      }
    }
    const validateConfirmPassword = (confirmPassword, password) => {
      if (confirmPassword != password) {
        return "Konfirmasi password belum sesuai";
      } else {
        return "";
      }
    }
    const validateEmail = (email) => {
      if (String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
        return ""
      } else {
        return "Penulisan Email belum sesuai"
      }
    }

    const nameError = validateName(name);
    const passwordError = validatePassword(password);
    const confirmPaswordError = validateConfirmPassword(confirmPassword, password);
    const emailError = validateEmail(email);

    const nameErrorUpdate = validateName(nameUpdate);
    const emailErrorUpdate = validateEmail(emailUpdate);

    async function getUserData(){
      setLoading(true);

      const res = await axios(
        `${apiUrl}/api/Auth/GetAllUsersAdmin`,{
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
      getUserData();
    } , [])

    const handleAdd = () => {
      setFirstEmail(false)
      setFirstPassword(false)
      setFirstConfirmPassword(false)
      setFirstName(false)
      
      if(passwordError || emailError || nameError || confirmPaswordError || role==null){
        console.log('Not Submitable')
      }else{
        console.log('Submitable')
        setLoading(true)
        //masukin code buat konek ke backend
        //insert code here
        axios.post(`${apiUrl}/RegisterUserAdmin`, {
          name: name,
          email: email,
          password: password,
          role: role
        }, {
          headers:{
            Authorization: `Bearer ${token}`
          }
        }).then(function (response) {
          setLoading(false);
          getUserData();
          handleSnackbar("Penambahan user berhasil", "success");
        })
        .catch(function (error) {
          setLoading(false);
          handleSnackbar("Terdapat kesalahan input", "error");
        });
      }
    }

    const handleUpdate = () => {
      setFirstEmailUpdate(false)
      setFirstNameUpdate(false)
      
      if(emailErrorUpdate || nameErrorUpdate || roleUpdate==null){
        console.log('Not Submitable')
      }else{
        console.log('Submitable')
        setLoading(true)
        //masukin code buat konek ke backend
        //insert code here
        axios.patch(`${apiUrl}/api/Auth/UpdateUserAdmin/${idUpdate}`, {
          name: nameUpdate,
          email: emailUpdate,
          role: roleUpdate
        }, {
          headers:{
            Authorization: `Bearer ${token}`
          }
        }).then(function (response) {
          setLoading(false);
          getUserData();
          handleSnackbar("Update user berhasil", "success");
        })
        .catch(function (error) {
          setLoading(false);
          handleSnackbar("Terdapat kesalahan input", "error");
        });
      }
    }

    const handleUpdateIsActivated = () => {
      setLoading(true)  
      axios.patch(`${apiUrl}/api/Auth/UpdateUserIsActivated/${idUpdate}`, {isActivated: isActivatedUpdate}, {headers:{
        Authorization: `Bearer ${token}`
      }}).then(function (response) {
        handleSnackbar("isActivated User berhasil diupdate", "success")
        getUserData();
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

          {/* ADD User */}
          <Typography marginBottom={2} fontSize={32} fontWeight={600} color="primary" textAlign={'center'}>
            User
          </Typography>
          <Typography fontSize={20} fontWeight={400} color="primary" textAlign={'center'}>
            Add User Data
          </Typography>
          <Stack gap={3}>
          <TextField
              fullWidth
              id="name"
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e)=>{
                setName(e.target.value)
                setFirstName(false)
              }}
              error={nameError == "" || firstName ? false : true}
              helperText={nameError == "" || firstName ? "" : nameError}
          />
          <TextField
              fullWidth
              id="email"
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e)=>{
                setEmail(e.target.value)
                setFirstEmail(false)
              }}
              error={emailError == "" || firstEmail ? false : true}
              helperText={emailError == "" || firstEmail ? "" : emailError}
          />
          <TextField
              fullWidth
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e)=>{
                setPassword(e.target.value)
                setFirstPassword(false)
              }}
              error={passwordError == "" || firstPassword  ? false : true}
              helperText={passwordError == "" || firstPassword  ? "" : passwordError}
          />
          <TextField
              fullWidth
              id="confirm password"
              label="Confirm Password"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e)=>{
                setConfirmPassword(e.target.value)
                setFirstConfirmPassword(false)
              }}
              error={confirmPaswordError == "" || firstConfirmPassword  ? false : true}
              helperText={confirmPaswordError == "" || firstConfirmPassword  ? "" : confirmPaswordError}
          />
          <TextField
            id="select-role"
            select
            label="Select Role"
            value={role}
            onChange={(e)=>setRole(e.target.value)}
          >
            {roleOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button onClick={handleAdd} variant="contained" color="secondary" style={{textTransform:'none'}} sx={{width:200, height:40, borderRadius: 2} }>ADD USER</Button>
          </Stack>

          {/* TABLE DATA */}
          <Typography marginTop={10} fontSize={24} fontWeight={500} color="primary" textAlign={'center'}>
            User's Data
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
              setEmailUpdate(rows.find(x=>x.id==item[0]).email)
              setRoleUpdate(rows.find(x=>x.id==item[0]).role)
              setIsActivatedUpdate(rows.find(x=>x.id==item[0]).isActivated)
            }}
            pageSizeOptions={[5, 10]}
            />

            {/* UPDATE User */}
            <Typography marginTop={5} fontSize={20} fontWeight={400} color="primary" textAlign={'center'}>
              Update User
            </Typography>
            <Stack gap={3} marginTop={2}>
            <TextField
              fullWidth
              id="User_id_update"
              label={!idUpdate? 'Pilih data di tabel terlebih dahulu' : 'User ID'}
              disabled
              value={idUpdate}
            />
            <TextField
              fullWidth
              id="nameUpdate"
              label="Name"
              variant="outlined"
              value={nameUpdate}
              onChange={(e)=>{
                setNameUpdate(e.target.value)
                setFirstNameUpdate(false)
              }}
              error={nameErrorUpdate == "" || firstNameUpdate ? false : true}
              helperText={nameErrorUpdate == "" || firstNameUpdate ? "" : nameErrorUpdate}
            />
            <TextField
                fullWidth
                id="emailUpdate"
                label="Email"
                type="email"
                variant="outlined"
                value={emailUpdate}
                onChange={(e)=>{
                  setEmailUpdate(e.target.value)
                  setFirstEmailUpdate(false)
                }}
                error={emailErrorUpdate == "" || firstEmailUpdate ? false : true}
                helperText={emailErrorUpdate == "" || firstEmailUpdate ? "" : emailErrorUpdate}
            />
            <TextField
              id="select-role"
              select
              label="Select Role"
              value={roleUpdate}
              onChange={(e)=>setRoleUpdate(e.target.value)}
            >
              {roleOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
              <Button onClick={handleUpdate} variant="contained" color="secondary" style={{textTransform:'none'}} sx={{width:200, height:40, borderRadius: 2} }>UPDATE USER</Button>
            </Stack>

            {/* UPDATE User isActivated */}
            <Typography marginTop={5} fontSize={20} fontWeight={400} color="primary" textAlign={'center'}>
              Update IsActivated
            </Typography>
            <Stack gap={3} marginTop={2}>
              <TextField
                fullWidth
                id="User_id_update_isActivated"
                label={!idUpdate? 'Pilih data di tabel terlebih dahulu' : 'User ID'}
                disabled
                value={idUpdate}
              />
              <TextField
                id="outlined-select-currency"
                select
                label="Select"
                helperText="User isActivated"
                value={isActivatedUpdate}
                onChange={(e)=>setIsActivatedUpdate(e.target.value)}
              >
                {isActivatedOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button onClick={handleUpdateIsActivated} variant="contained" color="secondary" style={{textTransform:'none'}} sx={{width:200, height:40, borderRadius: 2} }>UPDATE USER</Button>
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

export default AdminUser