import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import styled from 'styled-components';
import { IoPersonCircleSharp } from "react-icons/io5";
import { Button, Popover, Typography } from '@mui/material';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
  min-width: 100vw;
  overflow-x: hidden;
`;

const Header = styled.header`
  background-color: #f0f0f0; 
  padding: 1rem;
  display: flex;
  justify-content: space-around; 
  align-items: center;
`;



const Nav = styled.nav`
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
  }

  li {
    margin-left: 1rem; 
  }

  a {
    text-decoration: none;
    color: #333; 
    font-weight: bold;
  }
`;

const MainContent = styled.main`
  flex: 1; 
`;

const App = () => {

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    handleClose();
    window.location.href = '/login';
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const isLoggedIn = !!localStorage.getItem('token');


  return (
    <AppContainer>
      <Router>
        <Header>
          <Link to="/">
            <span className='logo'>ProjetoLogo</span>
          </Link>
          <Nav>
            <ul>
              <li>
                <Button aria-describedby={id} variant="contained" onClick={handleClick}>
                  <IoPersonCircleSharp size={24} />
                </Button>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <Typography sx={{ p: 2 }}>
                    {isLoggedIn ? (
                      <div className='divLogout' onClick={handleLogout}>Deslogar</div>
                    ) : (
                      <div className='divNav'>
                        <div onClick={handleClose}>
                          <Link className='linkNav' to="/login">Login</Link>
                        </div>
                        <div onClick={handleClose}>
                          <Link className='linkNav' to="/signup">SignUp</Link>
                        </div>
                      </div>
                    )}
                  </Typography>
                </Popover>
              </li>


            </ul>
          </Nav>
        </Header>

        <MainContent>
          <AppRoutes />
        </MainContent>


      </Router>
    </AppContainer>
  );
};

export default App;
