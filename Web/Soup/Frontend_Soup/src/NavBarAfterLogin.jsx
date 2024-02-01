import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

import logo from './assets/images/logo.png';
import Stack from '@mui/material/Stack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN, ROLE_USER } from './constant';
import useAuth from './customHook/useAuth';

const drawerWidth = 240;

function NavBarAfterLogin(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const {logout} = useAuth()
  const navigate = useNavigate()
  const Logout = () => {
    Cookies.remove(ACCESS_TOKEN);
    Cookies.remove(ROLE_USER);
    logout();
    navigate("/")
  }

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <img src={logo} alt="" onClick={() => navigate("/")} style={{cursor: "pointer"}} />
      <Divider />
      <List>  
        <ListItem key="CheckoutDrawer" disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={() => navigate("/checkout")}>
            <IconButton variant="outlined" color="primary">
              <ShoppingCartIcon/>
            </IconButton>
            <ListItemText primary='Checkout' />
          </ListItemButton>
        </ListItem>
        <ListItem key="MyclassDrawer" disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={() => navigate("/my-class")}>
            <ListItemText primary='My Class' />
          </ListItemButton>
        </ListItem>
        <ListItem key="InvoiceDrawer" disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={() => navigate("/invoice")}>
            <ListItemText primary='Invoice' />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem key="LogOutDrawer" disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={Logout}>
            <IconButton variant="outlined" color="primary">
              <LogoutIcon/>
            </IconButton>
            <ListItemText primary='Log Out' />
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
            <IconButton onClick={() => navigate("/checkout")} variant="outlined" color="primary" sx={{width:24, height:24} }>
              <ShoppingCartIcon/>
            </IconButton>
            <Button onClick={() => navigate("/my-class")} variant="text" color="primary" style={{textTransform:'none', fontSize:16}} sx={{width:105, height:40, borderRadius: 2}}>
              My Class
            </Button>
            <Button onClick={() => navigate("/invoice")} variant="text" color="primary" style={{textTransform:'none', fontSize:16}} sx={{width:105, height:40, borderRadius: 2}}>
              Invoice
            </Button>
            <Divider style={{ background: 'black' }} orientation="vertical" flexItem sx={{ borderRightWidth: 2 }} />
            <IconButton variant="outlined" color="secondary" sx={{width:24, height:24} }>
              <PersonIcon/>
            </IconButton>
            <IconButton onClick={Logout} variant="outlined" color="primary" sx={{width:24, height:24} }>
              <LogoutIcon/>
            </IconButton>
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

export default NavBarAfterLogin;