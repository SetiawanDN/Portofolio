import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

import logo from './assets/images/logo.png';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

function NavBar(props) {
  const navigate = useNavigate()
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <img src={logo} alt="" onClick={() => navigate("/")} style={{cursor: "pointer"}} />
      <Divider />
      <List>  
        <ListItem key="LoginDrawer" disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={() => navigate("/login")}>
            <ListItemText primary='Login' />
          </ListItemButton>
        </ListItem>
        <ListItem key="RegisterDrawer" disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={() => navigate("/register")}>
            <ListItemText primary='Register' />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" position="fixed" style={{ backgroundColor:'white', boxShadow:'none'}}>
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box  sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }}}>
            <img src={logo} alt="" onClick={() => navigate("/")} style={{cursor: "pointer"}}/>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Stack spacing={4} direction="row" alignItems={'center'}>
            <Button onClick={() => navigate("/login")} variant="outlined" color="primary" style={{textTransform:'none', fontSize:16}} sx={{width:175, height:40, borderRadius: 2} }>
              Login
            </Button>
            <Button onClick={() => navigate("/register")} variant="contained" color="secondary" style={{textTransform:'none', fontSize:16}} sx={{width:175, height:40, borderRadius: 2}}>
              Register
            </Button>
          </Stack>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Toolbar/>
    </Box>
  );
}

export default NavBar;