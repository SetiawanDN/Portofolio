import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import logo from './assets/images/logo.png';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router';
import Grid from '@mui/material/Grid'


const NavBarEmpty = () => {
    const navigate = useNavigate()
    return (
        <Box marginBottom={1}>
          <AppBar position="fixed" style={{ backgroundColor:'white', boxShadow:'none'}}>
            <Toolbar>
              <Grid container spacing={1} alignContent={"center"} alignItems={"center"}>
                <Grid item lg={12}>
                  <div><img src={logo} alt="" onClick={() => navigate("/")} /></div>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          <Toolbar/>
        </Box>
      );
}

export default NavBarEmpty